import { useEffect, useMemo, useState } from "react";
import { AuthContext, User, AuthContextType } from "./AuthContext";
import { setTokenGetter } from "../services/http";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // <-- add loading state

  // Load from localStorage once on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // done loading
  }, []);

  // let axios read current token (in-memory)
  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  // build context value
  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    loading, // <-- include loading
    isAuthenticated: Boolean(user && token),
    login: ({ user, token }: { user: User; token: string }) => {
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
