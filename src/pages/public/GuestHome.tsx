import { useState } from "react";
import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

type TimeSlot = {
  time: string;
  available: boolean;
};

type DoctorAvailability = {
  id: number;
  name: string;
  specialization: string;
  slots: TimeSlot[];
};

/* ============= MOCK DATA ================= */

const availabilityByDate: Record<string, DoctorAvailability[]> = {
  "2026-01-10": [
    {
      id: 1,
      name: "Dr. Ben Martinez",
      specialization: "Cardiologist",
      slots: [
        { time: "10:00 AM", available: true },
        { time: "11:00 AM", available: true },
        { time: "2:00 PM", available: false },
      ],
    },
  ],
 "2026-01-11": [
  {
    id: 2,
    name: "Dr. Samuel Chen",
    specialization: "General Practitioner",
    slots: [
      { time: "9:00 AM", available: true },
      { time: "1:00 PM", available: true },
    ],
  },
  {
    id: 3,
    name: "Dr. Leyla Al-Sayed",
    specialization: "Pediatrician",
    slots: [
      { time: "10:00 AM", available: true },
      { time: "3:00 PM", available: false },
    ],
  },
  {
    id: 4,
    name: "Dr. Ben Martinez",
    specialization: "Cardiologist",
    slots: [
      { time: "11:00 AM", available: true },
      { time: "4:00 PM", available: true },
    ],
  },
],
   "2026-01-01": [
    {
      id: 2,
      name: "Dr. Leyla Al-Sayed",
      specialization: "Pediatrician",
      slots: [
        { time: "9:00 AM", available: true },
        { time: "5:00 PM", available: true },
      ],
    },
  ],
   "2026-01-05": [
    {
      id: 2,
      name: "Dr. Ben martinez",
      specialization: "Cardiologist",
      slots: [
        { time: "11:00 AM", available: true },
        { time: "1:00 PM", available: true },
      ],
    },
  ],
};

/* ============= COMPONENT ================= */

const GuestHome: React.FC = () => {
  const [selectedDate, setSelectedDate] =
    useState<CalendarProps["value"]>(null);

  const [availableDoctors, setAvailableDoctors] =
    useState<DoctorAvailability[]>([]);

  const navigate = useNavigate();

  /* Calendar date change handler */
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    setSelectedDate(value);

    if (value instanceof Date) {
      const dateKey = value.toISOString().split("T")[0];
      setAvailableDoctors(availabilityByDate[dateKey] || []);
    } else {
      setAvailableDoctors([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 py-24">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to Your Health Journey
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Book your appointment with ease and connect with the best healthcare
          professionals
        </p>

        <div className="flex gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-indigo-700 transition"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/doctors")}
            className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-600 hover:text-white transition"
          >
            Find Doctors
          </button>
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <section className="flex justify-center pb-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            Select Appointment Date
          </h2>

          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* DOCTOR AVAILABILITY */}
      {availableDoctors.length > 0 && (
        <section className="flex justify-center pb-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4 text-center">
              Available Doctors
            </h3>

            {availableDoctors.map((doctor) => (
              <div key={doctor.id} className="mb-6 border-b pb-4">
                <h4 className="font-semibold text-lg">
                  {doctor.name}
                </h4>
                <p className="text-gray-600">
                  {doctor.specialization}
                </p>

                <div className="flex gap-3 flex-wrap mt-3">
                  {doctor.slots.map((slot, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        slot.available
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-500 line-through"
                      }`}
                    >
                      {slot.time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default GuestHome;
