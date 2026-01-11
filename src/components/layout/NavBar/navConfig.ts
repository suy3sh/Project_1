//role -> nav items mapping

import { NavItem, Role } from "./types";

export function getNavItems(role: Role, actions: {logout: () => void}): NavItem[] {
    switch (role) {
        case "GUEST":
            return [
                {kind: "link", label: "Doctors", to: "/doctors"},
                {kind: "link", label: "Login/Sign Up", to: "/login"},
            ];

        case "PATIENT":
            return [
                {kind: "link", label: "Doctors", to: "/doctors"},
                {kind: "link", label: "Book an Appointment", to: "/patient/book"},
                {kind: "link", label: "Profile", to: "/patient/profile"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];
        
        case "DOCTOR":
            return [
                {kind: "link", label: "Appointment Calendar", to: "/doctor/calendar"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];

        case "ADMIN":
            return [
                {kind: "link", label: "Schedules", to: "/admin/schedules"},
                {kind: "link", label: "Staff List", to: "/admin/staff"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];

        case "SUPER":
            return [
                //{kind: "link", label: "User Management", to: "/super/users"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];

        default:
            return [
                {kind: "link", label: "Doctors", to: "/doctors"},
                {kind: "link", label: "Login / Sign Up", to: "/login"},
            ];
    }
}