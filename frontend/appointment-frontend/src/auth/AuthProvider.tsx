import { useMemo, useState } from "react";
import { AuthContext, User } from "./AuthContext";

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) as User : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });

    const value = useMemo(() => {
        return {
            user,
            token,
            isAuthenticated: Boolean(user && token),

            login: ({user, token}: {user: User; token: string}) => {
                setUser(user);
                setToken(token);

                // Optional persistence
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("token", token);
            },

            logout: () => {
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
            },
        };
    }, [user, token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}