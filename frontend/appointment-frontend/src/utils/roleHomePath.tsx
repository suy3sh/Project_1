import { Role } from "../components/layout/NavBar/types";

export function roleHomePath(role: Role): string {
  switch (role) {
    case "PATIENT":
      return "/patient/home";
    case "DOCTOR":
      return "/doctor/home";
    case "ADMIN":
      return "/admin/home";
    case "SUPER":
      return "/super/home";
    default:
      return "/";
  }
}