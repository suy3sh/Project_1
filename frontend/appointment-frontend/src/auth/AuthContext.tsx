import { createContext } from "react";
import { Role } from "../components/layout/NavBar/types";

//SHAPE OF AUTH STATE
export type User = {
    id: number;
    email: string;
    role: Role;
}

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: {user: User; token: string}) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);