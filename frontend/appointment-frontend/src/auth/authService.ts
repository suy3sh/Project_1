import { Role } from "../components/layout/NavBar/types";
import { User } from "./AuthContext";

/**
 * FUTURE (JWT + backend):
 * Replace mockLogin() with a real API call:
 * POST /smart-appointment/api/login  (or /api/auth/login)
 * that returns { token, user } (or token then GET /auth/me).
 */
type LoginResponse = {
  token: string; // JWT (mock for now)
  user: User;  // AuthContext User
};

/**
 * MOCK login so frontend can be developed without backend.
 * FUTURE: delete this function once backend login is ready.
 * 
 * Example real API call:
 
  const res = await fetch("http://localhost:8080/smart-appointment/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

 * 
 */
export async function mockLogin(email: string, _password: string): Promise<LoginResponse> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 250));

  const e = email.toLowerCase();

  let role: Role = "PATIENT";
  if (e.includes("doctor")) role = "DOCTOR";
  if (e.includes("admin")) role = "ADMIN";
  if (e.includes("super")) role = "SUPER";

  return {
    token: "mock.jwt.token", // FUTURE: backend-issued JWT
    user: {
      id: 1,
      email,
      role,
    },
  };
}