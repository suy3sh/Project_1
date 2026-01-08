import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("patient");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    // TEMP login success
    if (role === "patient") {
      navigate("/patient/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-bold text-center text-purple-700">
          Smart Appointment System
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Log in to access your dashboard
        </p>

        {/* Role Selection */}
        <div className="mt-8">
          <p className="mb-3 font-medium text-gray-700">
            Select Your Role:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole("patient")}
              className={`border rounded-xl py-4 text-center transition
                ${
                  role === "patient"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "border-gray-300 text-purple-700 hover:bg-purple-50"
                }
              `}
            >
              🧑‍⚕️
              <p className="mt-2 font-semibold">Patient</p>
            </button>

            <button
              onClick={() => setRole("staff")}
              className="border rounded-xl py-4 text-center text-purple-700 hover:bg-purple-50"
            >
              👩‍💼
              <p className="mt-2 font-semibold">Staff</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg font-semibold text-white"
          >
            Log In
          </button>
        </form>
 {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Not registered yet?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;
