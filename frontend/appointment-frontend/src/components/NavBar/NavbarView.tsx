//presentational: markup/styles only

import { FaHospital } from "react-icons/fa6";
import { Link } from "react-router-dom";
import type { NavItem } from "./types";

type NavbarViewProps = {
  appName?: string;
  homeHref?: string; // optional: click title to go home
  items: NavItem[];
};

export default function NavbarView({
  appName = "Smart Appointment System",
  homeHref = "/",
  items,
}: NavbarViewProps) {
  return (
    <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between">
      <h1 className="flex items-center gap-3 text-2xl font-bold">
        <FaHospital />
        <Link to={homeHref} className="hover:opacity-90">
          {appName}
        </Link>
      </h1>

      <div className="space-x-6">
        {items.map((item) => {
          if (item.kind === "link") {
            return (
              <Link
                key={`${item.label}:${item.to}`}
                to={item.to}
                className="hover:opacity-90"
              >
                {item.label}
              </Link>
            );
          }

          // button
          return (
            <button
              key={`btn:${item.label}`}
              type="button"
              onClick={item.onClick}
              className="hover:opacity-90"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}