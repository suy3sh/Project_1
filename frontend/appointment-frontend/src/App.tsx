import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layouts
import GuestLayout from "./layouts/GuestLayout";
import PatientLayout from "./layouts/PatientLayout";
import DoctorLayout from "./layouts/DoctorLayout";

// Pages
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import DoctorsBrowse from "./pages/public/DoctorsBrowse";

import PatientHome from "./pages/patient/PatientHome";
import PatientProfile from "./pages/patient/PatientProfile";
import BookAppointment from "./pages/patient/BookAppointment";
import EditPatientProfile from "./pages/patient/EditPatientProfile";

import DoctorHome from "./pages/doctor/DoctorHome";
import DoctorCalendar from "./pages/doctor/DoctorCalendar";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminStaffList from "./pages/admin/AdminStaffList";
import Navbar from "./components/layout/NavBar/Navbar";
import SuperHome from "./pages/super/SuperHome";
import Home from "./pages/public/Home";

function App() {
//   return (
//     <Routes>
      
//  {/* protected routes */}
//       <Route
//   path="/patient"
//   element={
//     <ProtectedRoute>
//       <PatientLayout />
//     </ProtectedRoute>
//   }
// />

//       {/* Guest Routes */}
//       <Route element={<GuestLayout />}>
//         <Route path="/" element={<GuestHome />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/doctors" element={<DoctorsBrowse />} />
//       </Route>

//       {/* Patient Routes */}
//       <Route element={<PatientLayout />}>
//         <Route path="/patient/home" element={<PatientHome />} />
//         <Route path="/patient/profile" element={<PatientProfile />} />
//           <Route path="/patient/profile/edit" element={<EditPatientProfile />} /> 
//       <Route path="/patient/book" element={<BookAppointment />} />
//         <Route path="/patient/doctors" element={<DoctorsBrowse />} />
//       </Route>
      

//       {/* Doctor Routes */}
//       <Route element={<DoctorLayout />}>
//         <Route path="/doctor/home" element={<DoctorHome />} />
//         <Route path="/doctor/calendar" element={<DoctorCalendar />} />
//       </Route>

//     </Routes>
//   );

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
              <ProtectedRoute allowedRoles={["PATIENT"]}> 
                <PatientHome />
              </ProtectedRoute>
              } />
            <Route path="/patient/profile" element={
              <ProtectedRoute allowedRoles={["PATIENT"]}> 
                <PatientProfile />
              </ProtectedRoute>
              } />
            <Route path="/patient/profile/edit" element={
              <ProtectedRoute allowedRoles={["PATIENT"]}> 
                <EditPatientProfile />
              </ProtectedRoute>
              } />
            <Route path="/patient/book" element={
              <ProtectedRoute allowedRoles={["PATIENT"]}> 
                <BookAppointment />
              </ProtectedRoute>
              } />


            {/* Doctor Protected Routes */}
            <Route path="/doctor/home" element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorHome />
              </ProtectedRoute>
              } />
            <Route path="/doctor/calendar" element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}> 
                <DoctorCalendar />
              </ProtectedRoute>
              } />


            {/* Admin Protected Routes */}
            <Route path="/admin/home" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminSchedule />
              </ProtectedRoute>
              } />
            <Route path="/admin/staff" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}> 
                <AdminStaffList />
              </ProtectedRoute>
              } />


            {/* Super Admin Protected Routes */}
            <Route path="/super/home" element={
              <ProtectedRoute allowedRoles={["SUPER"]}>
                <SuperHome />
              </ProtectedRoute>
              } />
          </Routes>
        </>
        
      );
}

export default App;
