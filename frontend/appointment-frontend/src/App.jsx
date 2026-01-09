import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layouts
import GuestLayout from "./layouts/GuestLayout";
import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";

// Pages
import GuestHome from "./pages/public/GuestHome";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import DoctorsBrowse from "./pages/public/DoctorsBrowse";

import PatientHome from "./pages/patient/PatientHome";
import PatientProfile from "./pages/patient/PatientProfile";
import BookAppointment from "./pages/patient/BookAppointment";
import EditPatientProfile from "./pages/patient/EditPatientProfile";

function App() {
  return (
    <Routes>
      
 {/* protected routes */}
      <Route
  path="/patient"
  element={
    <ProtectedRoute>
      <PatientLayout />
    </ProtectedRoute>
  }
/>

      {/* Guest Routes */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<GuestHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorsBrowse />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<PatientLayout />}>
        <Route path="/patient/home" element={<PatientHome />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/patient/profile/edit" element={<EditPatientProfile />} /> 
      <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/doctors" element={<DoctorsBrowse />} />
      </Route>
      

      {/* Doctor Routes */}
      <Route element={<DoctorLayout />}>
        <Route path="/doctor/today" element={<div>Today</div>} />
        <Route path="/doctor/calendar" element={<div>Calendar</div>} />
      </Route>

    </Routes>
  );
}

export default App;
