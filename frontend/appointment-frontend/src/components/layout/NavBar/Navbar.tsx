// container; role logic = handlers

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import NavbarView from "./NavbarView";
import { getNavItems } from "./navConfig";
import type { Role } from "./types";
import { useAuth } from "../../../auth/useAuth";


export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: authLogout } = useAuth();

  // Derive role safely
  const role: Role = isAuthenticated ? (user?.role as Role) : "GUEST";

  const items = useMemo(() => {
    return getNavItems(role, {
      logout: () => {
        // Prefer your auth logout if you have it
        authLogout();

        // If your authLogout doesn't clear localStorage, you can still do:
        // localStorage.clear();

        navigate("/", { replace: true });
      },
    });
  }, [role, authLogout, navigate]);

  return <NavbarView items={items} />;
}