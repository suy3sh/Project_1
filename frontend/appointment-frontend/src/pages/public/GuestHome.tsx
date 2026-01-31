import { useNavigate } from "react-router-dom";
import { CalendarAvail } from "@/components/availability";
import type { DoctorAvailability } from "@/components/availability";
import { useEffect, useState } from "react";

const GuestHome: React.FC = () => {
  const navigate = useNavigate();


   // STATE to hold backend availability
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, DoctorAvailability[]>>({});
  const [loading, setLoading] = useState(true);
  // FETCH availability from backend
useEffect(() => {
    fetch("http://localhost:8080/smart-appointment/api/availability")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch availability");
        return res.json();
      })
      .then(data => setAvailabilityByDate(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 py-16 md:py-20">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Welcome
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Welcome to <span className="text-indigo-600">Your Health Journey</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Book your appointment with ease and connect with the best healthcare professionals.
        </p>

        <button
          onClick={() => navigate("/doctors")}
          className="group relative inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
        >
          Find Doctors
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </section>

      {/* MAIN CONTENT - CALENDAR & SIDEBAR SIDE BY SIDE */}
      <section className="px-4 md:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* CALENDAR - Takes more space */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Available Slots</h2>
                  <p className="text-sm text-gray-500">Select a time to start booking</p>
                </div>
              </div>

              <CalendarAvail
                availabilityByDate={availabilityByDate}
                onBook={(doctor, date) =>
                  navigate("/login", {
                    state: { redirectTo: "/patient/book", doctor, selectedDate: date },
                  })
                }
              />
            </div>
          </div>

          {/* SIDEBAR - Get Started (mirrors appointments card styling) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                    />
                    <circle cx="9" cy="7" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 8v6m3-3h-6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Get Started</h2>
                  <p className="text-sm text-gray-500">Sign in to book and manage appointments</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100">
                  <p className="text-gray-600 mb-4">
                    Create an account or sign in to book appointments and keep track of your schedule.
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="group relative inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
                    >
                      Log In
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                      className="inline-flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-700 px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-50 transition-all duration-300"
                    >
                      Create Account
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Tip: You can browse doctors as a guest, but you’ll need to sign in to confirm a booking.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHome;

