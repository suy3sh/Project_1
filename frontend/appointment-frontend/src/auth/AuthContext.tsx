import { createContext } from "react";
import { Role } from "../components/NavBar/types";

//SHAPE OF AUTH STATE
export type User = {
    id: number;
    email: string;
    role: Role;
    firstName?: string;
    lastName?: string;
}

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
     loading: boolean; 
    login: ({ user, token }: { user: User; token: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);