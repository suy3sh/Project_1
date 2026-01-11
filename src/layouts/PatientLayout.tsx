import { Outlet } from "react-router-dom";
import PatientNavbar from "../components/navbars/PatientNavbar";

const PatientLayout = () => {
  return (
    <>
      <PatientNavbar />
      <Outlet />
    </>
  );
};

export default PatientLayout;
