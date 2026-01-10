import { useMemo, useState } from "react";
import { AuthContext, User } from "./AuthContext";

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const value = useMemo(() => {
        return {
            user,
            token,
            isAuthenticated: Boolean(user && token),

            login: ({user, token}: {user: User; token: string}) => {
                setUser(user);
                setToken(token);

                // Optional persistence
                localStorage.setItem("token", token);
                localStorage.setItem("role", user.role);
            },

            logout: () => {
                setUser(null);
                setToken(null);
                localStorage.clear();
            },
        };
    }, [user, token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}