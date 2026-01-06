import { FaHospital } from "react-icons/fa6";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function GuestHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaHospital className="text-blue-600 text-3xl" />
            <h1 className="text-xl font-bold">
              Smart Appointment System
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Login
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Doctors
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="pt-24 text-center px-4">
        <h2 className="text-4xl font-bold mb-4">
          Welcome to Smart Appointment System
        </h2>
        <p className="text-gray-600 mb-10">
          View doctor availability and book appointments easily.
        </p>

        {/* Calendar */}
        <div className="bg-white inline-block p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            Doctor Availability
          </h3>
          <Calendar />
        </div>
      </section>
    </div>
  );
}

export default GuestHome;
