import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold">Admin Panel</h1>

      <div className="space-x-6">
        <Link to="/admin/schedules">Schedules</Link>
        <Link to="/admin/staff">Staff List</Link>
        <button onClick={() => navigate("/login")}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
