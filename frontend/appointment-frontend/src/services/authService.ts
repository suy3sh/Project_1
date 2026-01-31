import { Role } from "../components/NavBar/types";
import { User } from "../auth/AuthContext";
import { http } from "./http";
import { RegisterResponse, RegisterUserRequest } from "@/types/userTypes";

type LoginResponse = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  privilege:{
    privilegeId: number;
    roleName: string;
  };
  token: string;
};

export async function login(email: string, password: string): Promise<{user: User; token: string}>{
  const {data} = await http.post<LoginResponse>("/auth/login", {email, password});

  const roleName = data.privilege.roleName as Role;

  return {
    token: data.token,
    user:{
      id: data.userId,
      email: data.email,
      role: roleName,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };
}

export async function register(firstName: string, lastName: string, email: string, password: string): Promise<RegisterResponse>{
  const payload: RegisterUserRequest = {firstName, lastName, email, password, privilegeId: 1}

  const {data} = await http.post<RegisterResponse>("/auth/register", payload);
  return data
}