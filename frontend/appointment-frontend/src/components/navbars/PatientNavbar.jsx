import { FaHospital } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function PatientNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
};

  return (
    <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between">
      <h1 className="flex items-center gap-3 text-2xl font-bold">
         <FaHospital />
        Smart Appointment System</h1>

      <div className="space-x-6">
        <Link to="/patient/doctors">Doctors</Link>
        {/*<Link to="/book_appt">Book Appointment</Link>*/}
        <Link to="/patient/profile">Profile</Link>
        <Link to="/patient/book">Book Appointment</Link>

        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default PatientNavbar;
