import { useState, useContext } from "react";
import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/auth/AuthContext";
import { DoctorAvailability, TimeSlot } from "./types";
import { formatTime } from "@/utils/validators";

type CalendarAvailProps = {
  availabilityByDate: Record<string, DoctorAvailability[]>;
  onBook: (doctor: DoctorAvailability, slot: TimeSlot) => void;
};

const CalendarAvail: React.FC<CalendarAvailProps> = ({
  availabilityByDate,
  onBook,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [availableDoctors, setAvailableDoctors] = useState<
    DoctorAvailability[]
  >([]);

  //  Hooks must be inside the component
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setSelectedDate(value);

      const dateKey = value.toLocaleDateString("en-CA"); // YYYY-MM-DD
      setAvailableDoctors(availabilityByDate[dateKey] || []);
    } else {
      setAvailableDoctors([]);
    }
  };

  return (
    <>
      {/* CALENDAR */}
      <section className="flex justify-center pb-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            Select Appointment Date
          </h2>

          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="rounded-lg"
            tileClassName={({ date, view }) => {
              if (view === "month") {
                const dateKey = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
                if (availabilityByDate[dateKey]?.length > 0) {
                  // Highlight dates with available doctors
                  return "bg-green-100 text-green-800 font-semibold rounded-full";
                }
              }
              return "";
            }}
          />
        </div>
      </section>

      {/* AVAILABILITY */}
      {availableDoctors.length > 0 && (
        <section className="flex justify-center pb-20">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
            <h3 className="text-xl font-bold mb-4 text-center">
              Available Doctors
            </h3>

            {availableDoctors.map((doctor) => (
              <div key={doctor.doctorId} className="mb-6 border-b pb-4">
                <h4 className="font-semibold text-lg">{doctor.doctorName}</h4>
                <p className="text-gray-600">{doctor.specialization}</p>

                <div className="flex gap-3 flex-wrap mt-3">
                  {doctor.slots.map((slot) => (
                    <button
                      key={slot.slotId}
                      disabled={!slot.available}
                      onClick={() => {
                        if (!slot.available) return;

                        if (auth && auth.isAuthenticated) {
                          // Patient: go to book appointment page with state
                          navigate("/patient/book", {
                            state: {
                              doctorId: doctor.doctorId,
                              selectedDate: selectedDate
                                ?.toISOString()
                                .split("T")[0],
                              selectedTime: slot.startTime,
                              role: "patient",
                            },
                          });
                        } else {
                          // Guest: go to login
                          navigate("/login");
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition ${
                        slot.available
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default CalendarAvail;
