// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [role, setRole] = useState("patient");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!username || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     // TEMP login success
//     if (role === "patient") {
//       navigate("/patient/home");
//     } else if (role === "staff") {
//       navigate("/doctor/home");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
//         <h1 className="text-3xl font-bold text-center text-purple-700">
//           Smart Appointment System
//         </h1>
//         <p className="text-center text-gray-500 mt-2">
//           Log in to access your dashboard
//         </p>

//         {/* Role Selection */}
//         <div className="mt-8">
//           <p className="mb-3 font-medium text-gray-700">
//             Select Your Role:
//           </p>

//           <div className="grid grid-cols-2 gap-4">
//             <button
//               onClick={() => setRole("patient")}
//               className={`border rounded-xl py-4 text-center transition
//                 ${
//                   role === "patient"
//                     ? "bg-purple-600 text-white border-purple-600"
//                     : "border-gray-300 text-purple-700 hover:bg-purple-50"
//                 }
//               `}
//             >
//               🧑‍⚕️
//               <p className="mt-2 font-semibold">Patient</p>
//             </button>

//             <button
//               onClick={() => setRole("staff")}
//               className="border rounded-xl py-4 text-center text-purple-700 hover:bg-purple-50"
//             >
//               👩‍💼
//               <p className="mt-2 font-semibold">Staff</p>
//             </button>
//           </div>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleLogin} className="mt-8 space-y-5">
//           <div>
//             <label className="block text-sm mb-1 text-gray-600">
//               Username
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter your username"
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-1 text-gray-600">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg font-semibold text-white"
//           >
//             Log In
//           </button>
//         </form>
//  {/* Sign Up Link */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           Not registered yet?{" "}
//           <span
//             onClick={() => navigate("/register")}
//             className="text-purple-600 font-semibold cursor-pointer hover:underline"
//           >
//             Sign up
//           </span>
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Login;

import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Role } from "../../components/layout/NavBar/types";
import { useAuth } from "../../auth/useAuth"

function roleHomePath(role: Role): string {
  switch (role) {
    case "PATIENT":
      return "/patient/home";
    case "DOCTOR":
      return "/doctor/home";
    case "ADMIN":
      return "/admin/home";
    case "SUPER":
      return "/super/home";
    default:
      return "/";
  }
}

/**
 * FUTURE (JWT + backend):
 * Replace mockLogin() with a real API call:
 * POST /smart-appointment/api/login  (or /api/auth/login)
 * that returns { token, user } (or token then GET /auth/me).
 */
type LoginResponse = {
  token: string; // JWT (mock for now)
  user: {
    id: number;
    email: string;
    role: Role;
  };
};

/**
 * MOCK login so frontend can be developed without backend.
 * FUTURE: delete this function once backend login is ready.
 * 
 * Example real API call:
 
  const res = await fetch("http://localhost:8080/smart-appointment/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

 * 
 */
async function mockLogin(email: string, _password: string): Promise<LoginResponse> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 250));

  const e = email.toLowerCase();

  let role: Role = "PATIENT";
  if (e.includes("doctor")) role = "DOCTOR";
  if (e.includes("admin")) role = "ADMIN";
  if (e.includes("super")) role = "SUPER";

  return {
    token: "mock.jwt.token", // FUTURE: backend-issued JWT
    user: {
      id: 1,
      email,
      role,
    },
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // matches AuthContext

  const [email, setEmail] = useState("patient@test.com");
  const [password, setPassword] = useState("password");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      // MOCK login for now
      const res = await mockLogin(email, password);

      // Update AuthContext using YOUR expected shape
      login({ user: res.user, token: res.token });

      // If redirected here from ProtectedRoute, go back after login
      const state = location.state as { from?: string } | null;
      const from = state?.from;
      const roleHome = roleHomePath(res.user.role);
      const destination = from && from !== "/" && from !== "/login" ? from : roleHome;
      navigate(destination, { replace: true });

      // FUTURE (JWT + backend):
      // 1) Replace mockLogin with real login API call
      // 2) Store the returned JWT in AuthProvider/login
      // 3) fetch /auth/me to confirm role
    } catch {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-purple-700">
          Smart Appointment System
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Log in to access your dashboard
        </p>

        {/* Dev Tip (kept, restyled to match) */}
        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700">Testing Tip</p>
          <p className="mt-1 text-sm text-gray-600">
            Use <code className="font-mono text-purple-700">doctor@test.com</code>,{" "}
            <code className="font-mono text-purple-700">admin@test.com</code>, or{" "}
            <code className="font-mono text-purple-700">super@test.com</code> to test different role navbars.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg font-semibold text-white disabled:opacity-60 disabled:hover:bg-purple-600"
          >
            {busy ? "Signing in..." : "Log In"}
          </button>
        </form>

        {/* Sign Up Link (optional, matches the reference component) */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Not registered yet?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/register");
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}