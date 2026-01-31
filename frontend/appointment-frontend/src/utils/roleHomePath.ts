import { Role } from "../components/NavBar/types";

export function roleHomePath(role: Role): string {
  switch (role) {
    case "Patient":
      return "/patient/home";
    case "Doctor":
      return "/doctor/home";
    case "Admin":
      return "/admin/home";
    case "Super":
      return "/super/home";
    default:
      return "/";
  }
}