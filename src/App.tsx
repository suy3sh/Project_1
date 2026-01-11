import { Routes, Route, Navigate } from "react-router-dom";

import GuestLayout from "./layouts/GuestLayout";
import GuestHome from "./pages/public/GuestHome";
import Login from "./pages/public/Login";
import DoctorsBrowse from "./pages/public/DoctorsBrowse";
import PatientProfile from "./pages/patient/PatientProfile";
import EditPatientProfile from "./pages/patient/EditPatientProfile";
import PatientLayout from "./layouts/PatientLayout";
import PatientHome from "./pages/patient/PatientHome";
import ProtectedRoute from "./routes/ProtectedRoute";
import  BookAppointment from "./pages/patient/BookAppointment";
function App() {
  return (
    <Routes>
      {/* ===== GUEST ROUTES ===== */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<DoctorsBrowse />} />
      </Route>

      {/* ===== PATIENT ROUTES ===== */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientHome />} />
        <Route path="doctors" element={<DoctorsBrowse />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="profile/edit" element={<EditPatientProfile />} />
        <Route path="book" element={<BookAppointment />} />
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
