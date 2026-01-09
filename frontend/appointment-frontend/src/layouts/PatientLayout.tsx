import PatientNavbar from "../components/navbars/PatientNavbar";

import { Outlet } from "react-router-dom";

function PatientLayout() {
  return (
    <>
      <PatientNavbar />
      <Outlet />
    </>
  );
}

export default PatientLayout;
