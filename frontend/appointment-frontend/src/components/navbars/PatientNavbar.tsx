import { FaHospital } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const PatientNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* LEFT */}
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
        <FaHospital />
        <span>Smart Appointment System</span>
      </div>

      {/* CENTER LINKS */}
      <div className="flex gap-6 text-gray-700 font-medium">
        <Link to="/patient" className="hover:text-indigo-600">
          Home
        </Link>
        <Link to="/patient/doctors" className="hover:text-indigo-600">
          Doctors
        </Link>
        <Link to="/patient/profile" className="hover:text-indigo-600">
          Profile
        </Link>
      </div>

      {/* RIGHT */}
      <button
        onClick={handleLogout}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default PatientNavbar;
