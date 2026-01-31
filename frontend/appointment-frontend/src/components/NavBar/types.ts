export type Role = "Guest" | "Patient" | "Doctor" | "Admin" | "Super";

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