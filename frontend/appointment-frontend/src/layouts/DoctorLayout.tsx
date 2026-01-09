import DoctorNavbar from "../components/navbars/DoctorNavbar";
import { Outlet } from "react-router-dom";

function DoctorLayout() {
  return (
    <>
      <DoctorNavbar />
      <Outlet />
    </>
  );
}

export default DoctorLayout;
