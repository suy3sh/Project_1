import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import {
  DoctorsBrowse,
  GuestHome,
  BookAppointment,
  PatientProfile,
} from "./pages/index";
import Login from "./pages/public/Login"; // 👈 ADD THIS

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />} /> {/* 👈 ADD THIS */}
        <Route path="/doctors" element={<DoctorsBrowse />} />
        <Route path="/book_appt" element={<BookAppointment />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="*" element={<div className="p-6">404 - Page not found</div>} />
      </Routes>
    </>
  );
}

export default App;
