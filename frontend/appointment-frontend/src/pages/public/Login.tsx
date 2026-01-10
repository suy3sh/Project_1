import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth"
import { mockLogin } from "../../auth/authService";
import { roleHomePath } from "../../utils/roleHomePath";
import { Login } from "..";
import LoginForm from "../../components/LoginForm";



export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // matches AuthContext
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  async function handleSubmit(payload: { email: string; password: string }) {
    
    setError(null);
    setBusy(true);

    try {
      // MOCK login for now
      const res = await mockLogin(payload.email, payload.password);

      // Update AuthContext using YOUR expected shape
      login({ user: res.user, token: res.token });

      // If redirected here from ProtectedRoute, go back after login
      const state = location.state as { from?: string } | null;
      const from = state?.from;
      
      const roleHome = roleHomePath(res.user.role);
      const destination = from && from !== "/" && from !== "/login" ? from : roleHome;

      navigate(destination, { replace: true });

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

        {/* Dev Tip (THIS IS TEMPORARY) */}
        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm font-semibold text-purple-700">Testing Tip</p>
          <p className="mt-1 text-sm text-gray-600">
            Use <code className="font-mono text-purple-700">doctor@test.com</code>,{" "}
            <code className="font-mono text-purple-700">admin@test.com</code>, or{" "}
            <code className="font-mono text-purple-700">super@test.com</code> to test different role navbars.
          </p>
        </div>

        {/* Login Form */}
        <LoginForm 
          initialEmail="patient@test.com"
          initialPassword="password"
          busy={busy}
          error={error}
          onSubmit={handleSubmit}
        />  

        {/* Sign Up Link */}
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