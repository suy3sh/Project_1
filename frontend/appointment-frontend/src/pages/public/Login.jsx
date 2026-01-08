import { useNavigate } from "react-router-dom"; 

function Login() {

  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Patient Login */}
          <div>
            <h2 className="text-3xl font-bold text-purple-700 mb-6">
              Patient Login
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="patient@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              
              <p className="text-sm text-purple-600 hover:underline cursor-pointer" onClick={() => navigate("/register")}>
                Don't have an account? Sign up here.
              </p>
              

              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                Login
              </button>
            </div>
          </div>

          {/* Doctor Login */}
          <div>
            <h2 className="text-3xl font-bold text-purple-700 mb-6">
              Staff Login
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="staff@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                Login
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
