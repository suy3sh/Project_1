export type Role = "GUEST" | "PATIENT" | "DOCTOR" | "ADMIN" | "SUPER";

export type NavItem =
  | {
      kind: "link";
      label: string;
      to: string;
    }
  | {
      kind: "button";
      label: string;
      onClick: () => void;
    };