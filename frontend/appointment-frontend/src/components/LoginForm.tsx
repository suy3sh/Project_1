import { useState } from "react";


type Props = {
    initialEmail: string;
    initialPassword: string;
    busy?: boolean;
    error?: string | null;
    onSubmit: (payload: { email: string; password: string }) => void | Promise<void>;
}

export default function LoginForm({
    initialEmail = "",
    initialPassword = "",
    busy = false,
    error = null,
    onSubmit,
}: Props) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState(initialPassword);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("HandleSubmit: Submit Successful");
        onSubmit({ email, password });
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
    )
}