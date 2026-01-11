import { useState } from "react";
import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

const PatientHome: React.FC = () => {
  const [selectedDate, setSelectedDate] =
    useState<CalendarProps["value"]>(null);

  const navigate = useNavigate();

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    setSelectedDate(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to Your Health Journey
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Book your appointment with ease and connect with the best healthcare professionals
        </p>

        <button
          onClick={() => navigate("/patient/doctors")}
          className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-600 hover:text-white transition"
        >
          Find Doctors
        </button>
      </section>

      <section className="flex justify-center pb-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            Doctor Availability
          </h2>

          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </section>
    </div>
  );
};

export default PatientHome;
