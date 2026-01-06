import { useState } from "react";
import { FaHospital, FaUserDoctor } from "react-icons/fa6";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function GuestHome() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">

      {/* NAVBAR */}
      <nav className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
          
          <div className="flex items-center gap-3 text-2xl font-bold">
            <FaHospital />
            Smart Appointment System
          </div>

          <div className="flex gap-6">
            <button className="hover:underline">Home</button>
            <button className="hover:underline">About</button>
            <button className="hover:underline">Contact</button>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to Your Health Journey
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Book your appointment with ease and connect with the best healthcare professionals
        </p>

        <div className="flex gap-6">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-indigo-700 transition">
            Sign Up
          </button>

          <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-600 hover:text-white transition">
            Find Doctors
          </button>
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <section className="flex justify-center pb-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            Doctor Availability
          </h2>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-lg"
          />
        </div>
      </section>

    </div>
  );
}

export default GuestHome;
