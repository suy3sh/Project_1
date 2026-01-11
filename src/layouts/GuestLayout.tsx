import { Outlet } from "react-router-dom";
import GuestNavbar from "../components/navbars/GuestNavbar";
export default function GuestLayout() {
  return (
    <>
      {/* Navbar later */}
      <GuestNavbar />
      <Outlet />
    </>
  );
}
