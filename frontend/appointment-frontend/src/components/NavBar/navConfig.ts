//role -> nav items mapping

/*import { NavItem, Role } from "./types";

export function getNavItems(role: Role, actions: {logout: () => void}): NavItem[] {
    switch (role) {
        case "Guest":
            return [
                {kind: "link", label: "Doctors", to: "/doctors"},
                {kind: "link", label: "Login/Sign Up", to: "/login"},
            ];

        case "Patient":
            return [
                {kind: "link", label: "Doctors", to: "/doctors"},
                {kind: "link", label: "Book an Appointment", to: "/patient/book"},
                {kind: "link", label: "Profile", to: "/patient/profile"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];
        
        case "Doctor":
            return [
                {kind: "link", label: "Appointment Calendar", to: "/doctor/calendar"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];

        case "Admin":
            return [
                {kind: "link", label: "Schedules", to: "/admin/home"},
                {kind: "link", label: "Staff List", to: "/admin/staff"},
                {kind: "button", label: "Logout", onClick: actions.logout},
            ];

        case "Super":
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
}*/

// role -> nav items mapping

import { NavItem, Role } from "./types";

export function getNavItems(
  role: Role,
  actions: { logout: () => void }
): NavItem[] {

  // 🔹 Public for ALL roles
  const common: NavItem[] = [
    { kind: "link", label: "Doctors", to: "/doctors" },
  ];

  switch (role) {
    case "Guest":
      return [
        ...common,
        { kind: "link", label: "Login / Sign Up", to: "/login" },
      ];

    case "Patient":
      return [
        ...common,
        { kind: "link", label: "Profile", to: "/patient/profile" },
        { kind: "button", label: "Logout", onClick: actions.logout },
      ];

    case "Doctor":
      return [
        ...common, // ✅ Doctors link now visible
        { kind: "link", label: "Appointment Calendar", to: "/doctor/calendar" },
        { kind: "button", label: "Logout", onClick: actions.logout },
      ];

    case "Admin":
      return [
        ...common,
        { kind: "link", label: "Dashboard", to: "/admin/home" },
        { kind: "button", label: "Logout", onClick: actions.logout },
      ];

    case "Super":
      return [
        ...common,
        { kind: "button", label: "Logout", onClick: actions.logout },
      ];

    default:
      return common;
  }
}
