import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/auth/AuthContext";
import CalendarAvail from "@/components/availability/CalendarAvail";
import type { DoctorAvailability } from "@/components/availability/types";
import { useLocation } from "react-router-dom";
import { AppointmentDto } from "@/types/appointmentTypes";
import { fetchAvailability } from "@/services/availabilityService";
import { fetchAppointmentsForPatient } from "@/services/appointmentService";

/*interface Appointment {
  appointmentId: number;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
}*/

const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const location = useLocation();
  {location.state?.successMessage && (
    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
      {location.state.successMessage}
    </div>
  )}
  // STATE
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [availabilityByDate, setAvailabilityByDate] =
    useState<Record<string, DoctorAvailability[]>>({});
  //const [appointments, setAppointments] = useState<Appointment[]>([]);

  // FETCH availability from backend
  //FETCH FIX
  const fetchAvailabilityData = async () => {
    try {
      const data = await fetchAvailability();
      setAvailabilityByDate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // FETCH patient appointments
  //FETCH FIX
  const fetchAppointmentsData = async () => {
    if (!auth?.user) return;

    try {
      const appointments = await fetchAppointmentsForPatient(auth.user.id);
      setAppointments(appointments);
    } catch (err) {
      console.error(err);
    }
  };

  // INITIAL DATA FETCH
  useEffect(() => {
    fetchAvailabilityData();
    fetchAppointmentsData();
  }, [auth]);

  // BOOKING handler
  const handleBookSlot = (doctorId: number, slotId: number) => {
    if (!auth || !auth.user) return;
    //FETCH FIX
    fetch("http://localhost:8080/smart-appointment/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: auth.user.id, doctorId, slotId }),
    })
      .then((res) => res.json())
      .then((newAppointment) => {
        alert("Slot booked successfully!");

        // Map backend response to your Appointment type
        const mappedAppointment: AppointmentDto = {
          appointmentId: newAppointment.appointmentId,
          doctorName: newAppointment.doctorName,
          appointmentType: newAppointment.appointmentType,
          startTime: newAppointment.startTime,  // backend ISO string
          endTime: newAppointment.endTime,      // backend ISO string
          status: newAppointment.status,
        };

        // Append new appointment to state immediately
        setAppointments((prev) => [...prev, mappedAppointment]);

        // Update availability if needed
        fetchAvailability();
         alert("Slot booked successfully!");

      })
      .catch((err) => console.error(err));
  };

  // AUTH GUARD
  if (!auth || !auth.isAuthenticated || !auth.user) {
    return (
      <h1 className="text-5xl font-extrabold text-gray-800 mb-6">Welcome</h1>
    );
  }

  const { firstName } = auth.user;

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 py-16 md:py-20">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Welcome
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Hello, <span className="text-indigo-600">{firstName}</span>!
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </section>

      {/* MAIN CONTENT - CALENDAR & APPOINTMENTS SIDE BY SIDE */}
      <section className="px-4 md:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* CALENDAR - Takes more space */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-2xl">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Available Slots</h2>
                  <p className="text-sm text-gray-500">Select a time that works for you</p>
                </div>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Loading availability...</p>
                </div>
              ) : (
                <CalendarAvail
                  availabilityByDate={availabilityByDate}
                  onBook={(doctor, slot) => handleBookSlot(doctor.doctorId, slot.slotId)}
                />
              )}
            </div>
          </div>

          {/* APPOINTMENTS - Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100 lg:sticky lg:top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your Appointments</h2>
                  <p className="text-sm text-gray-500">{appointments.length} upcoming</p>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-2">No appointments yet</p>
                  <p className="text-sm text-gray-400">Book your first appointment from the calendar</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {appointments.map((app) => (
                    <div
                      key={app.appointmentId}
                      className="group relative bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300"
                    >
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'confirmed' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : app.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {app.status}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {app.doctorName?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.doctorName}</p>
                          <p className="text-xs text-gray-500">Doctor</p>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(app.startTime).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(app.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          {" - "}
                          {new Date(app.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PatientHome;