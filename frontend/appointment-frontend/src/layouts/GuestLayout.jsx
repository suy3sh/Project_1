import GuestNavbar from "../components/navbars/GuestNavbar";
import { Outlet } from "react-router-dom";

function GuestLayout() {
  return (
    <>
      <GuestNavbar />
      <Outlet />
    </>
  );
}

export default GuestLayout;
