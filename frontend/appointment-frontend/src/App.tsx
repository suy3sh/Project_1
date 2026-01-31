import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Pages
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import DoctorsBrowse from "./pages/public/DoctorsBrowse";

import PatientHome from "./pages/patient/PatientHome";
import PatientProfile from "./pages/patient/PatientProfile";
import BookAppointment from "./pages/patient/BookAppointment";
import EditPatientProfile from "./pages/patient/EditPatientProfile";

import DoctorHome from "./pages/doctor/DoctorHome";
//import DoctorCalendar from "./pages/doctor/DoctorCalendar";
import DoctorCalendarPage from "./pages/doctor/DoctorCalendarPage";


import AdminHome from "./pages/admin/AdminHome";
import Navbar from "./components/NavBar/Navbar";
import SuperHome from "./pages/super/SuperHome";
import Home from "./pages/public/Home";

function App() {

      return (
        <>
          <Navbar />

          <Routes>

            <Route path="/" element={<Home />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorsBrowse />} />


            {/* Patient Protected Routes */}
            <Route path="/patient/home" 
            element={
              <ProtectedRoute allowedRoles={["Patient"]}> 
                <PatientHome />
              </ProtectedRoute>
              } />
            <Route path="/patient/profile" element={
              <ProtectedRoute allowedRoles={["Patient"]}> 
                <PatientProfile />
              </ProtectedRoute>
              } />
            <Route path="/patient/profile/edit" element={
              <ProtectedRoute allowedRoles={["Patient"]}> 
                <EditPatientProfile />
              </ProtectedRoute>
              } />
            <Route path="/patient/book" element={
              <ProtectedRoute allowedRoles={["Patient"]}> 
                <BookAppointment />
              </ProtectedRoute>
              } />


            {/* Doctor Protected Routes */}
            <Route path="/doctor/home" element={
              <ProtectedRoute allowedRoles={["Doctor"]}>
                <DoctorHome />
              </ProtectedRoute>
              } />
            <Route path="/doctor/calendar" element={
              <ProtectedRoute allowedRoles={["Doctor"]}> 
                <DoctorCalendarPage />
              </ProtectedRoute>
              } />


            {/* Admin Protected Routes */}
            <Route path="/admin/home" element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <AdminHome />
              </ProtectedRoute>
              } />


            {/* Super Admin Protected Routes */}
            <Route path="/super/home" element={
              <ProtectedRoute allowedRoles={["Super"]}>
                <SuperHome />
              </ProtectedRoute>
              } />
          </Routes>
        </>
        
      );
}

export default App;
