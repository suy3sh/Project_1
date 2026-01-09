import { Link, useNavigate } from "react-router-dom";

function DoctorNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold cursor-pointer" onClick={() => navigate("/doctor/home")}>Doctor Dashboard</h1>

      <div className="space-x-6">
        <Link to="/doctor/calendar ">Appointment Calendar</Link>
        <button onClick={() => navigate("/login")}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default DoctorNavbar;

