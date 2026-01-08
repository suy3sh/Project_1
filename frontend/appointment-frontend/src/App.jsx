import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";

// Patient pages
import PatientHome from "./pages/patient/PatientHome";
import PatientProfile from "./pages/patient/PatientProfile";
import EditPatientProfile from "./pages/patient/EditPatientProfile";

// Guest / Public pages
import {
  DoctorsBrowse,
  GuestHome,
  BookAppointment,
  Register,
} from "./pages/index";
import Login from "./pages/public/Login";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Guest routes */}
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<DoctorsBrowse />} />
        <Route path="/book_appt" element={<BookAppointment />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes */}
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route
          path="/patient/profile/edit"
          element={<EditPatientProfile />}
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<div className="p-6">404 - Page not found</div>}
        />
      </Routes>
    </>
  );
}

export default App;