// src/pages/BookAppointment.tsx
import DoctorBrowseFilters from "@/components/doctor/DoctorBrowseFilters";
import { useDoctorsBrowse } from "@/services/useDoctorBrowse";
import { AppointmentType, Doctor } from "@/types/doctorTypes";
import type { TimeSlot } from "@/types/slotTypes";
import { useEffect, useState, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "@/auth/AuthContext";
import { fetchDoctorSlots } from "@/services/slotService";
import { formatTime } from "@/utils/validators";

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= AUTH ================= */
  const auth = useContext<AuthContextType | null>(AuthContext);
  const user = auth?.user ?? null;
  const isAuthenticated = auth?.isAuthenticated ?? false;

  /* ================= PREFILL ================= */
  const prefillQuery: string | undefined = location.state?.prefillQuery;
  const preselectedDoctorId: number | undefined =
    location.state?.doctorId ??
    location.state?.doctor?.doctorId ??
    location.state?.doctor?.id;

  const didPrefillRef = useRef(false);

  /* ================= DATA ================= */
  const {
    filteredDoctors = [],
    loading,
    error,
    query,
    setQuery,
    speciality,
    setSpeciality,
    gender,
    setGender,
    specialityOptions = [],
    genderOptions = [],
  } = useDoctorsBrowse();

  /* ================= STATE ================= */
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentType | null>(null);
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  /* ================= EFFECTS ================= */
  // Prefill query and doctor selection
  useEffect(() => {
    if (!didPrefillRef.current && prefillQuery) {
      setQuery(prefillQuery);
      didPrefillRef.current = true;
    }

    if (preselectedDoctorId && filteredDoctors.length > 0) {
      const found = filteredDoctors.find(
        (d) => d.doctorId === preselectedDoctorId
      );
      if (found) setSelectedDoctor(found);
    }
  }, [prefillQuery, preselectedDoctorId, filteredDoctors, setQuery]);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctor || !date) return;

    const fetchSlots = async () => {
      try {
        const slots: TimeSlot[] = await fetchDoctorSlots(
          selectedDoctor.doctorId,
          date
        );
        setAvailableSlots(slots);
        setSelectedSlotId(null); // reset selection on change
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      }
    };

    fetchSlots();
  }, [selectedDoctor, date]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedAppointment || !selectedSlotId || !user) return;

    if (!isAuthenticated || user.role !== "Patient") {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/smart-appointment/api/appointments/book",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slotId: selectedSlotId,
            patientId: user.id,
            typeId: selectedAppointment.typeId,
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      console.log("Appointment booked:", data);

         navigate("/patient/home", {
      state: { successMessage: "Appointment booked successfully!" }
    });
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  /* ================= GUARDS ================= */
  if (loading) return <div className="p-10 text-center">Loading doctors...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-purple-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Book Appointment</h1>

        {/* STEP 1: Select Doctor */}
        <DoctorBrowseFilters
          query={query}
          onQueryChange={setQuery}
          speciality={speciality}
          onSpecialityChange={setSpeciality}
          gender={gender}
          onGenderChange={setGender}
          specialityOptions={specialityOptions}
          genderOptions={genderOptions}
        />

        <div className="space-y-4 mb-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.doctorId}
              onClick={() => {
                setSelectedDoctor(doctor);
                setSelectedAppointment(null);
              }}
              className={`border p-4 rounded cursor-pointer ${
                selectedDoctor?.doctorId === doctor.doctorId
                  ? "border-purple-600 bg-purple-50"
                  : ""
              }`}
            >
              Dr. {doctor.user?.firstName} {doctor.user?.lastName} -{" "}
              {doctor.speciality?.specialityName ?? "General"}
            </div>
          ))}
        </div>

        {/* STEP 2: Select Appointment Type */}
        {selectedDoctor?.speciality?.appointmentTypes && (
          <>
            <h2 className="font-semibold mb-3">Select Appointment Type</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {selectedDoctor.speciality.appointmentTypes.map((type) => (
                <button
                  key={type.typeId}
                  onClick={() => setSelectedAppointment(type)}
                  className={`border p-3 rounded ${
                    selectedAppointment?.typeId === type.typeId
                      ? "border-purple-600 bg-purple-50"
                      : ""
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 3: Select Date */}
        {selectedAppointment && (
          <>
            <h2 className="font-semibold mb-3">Select Date</h2>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded mb-4"
            />
          </>
        )}

        {/* STEP 4: Select Time Slot */}
        {availableSlots.length > 0 && (
          <>
            <h2 className="font-semibold mb-3">Select Time Slot</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {availableSlots.map((slot) => (
                <button
                  key={slot.slotId}
                  onClick={() => setSelectedSlotId(slot.slotId)}
                  disabled={!slot.available}
                  className={`border p-3 rounded ${
                    selectedSlotId === slot.slotId
                      ? "border-purple-600 bg-purple-50"
                      : ""
                  } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* CONFIRM BUTTON */}
        <div className="text-center">
          <button
            disabled={!selectedSlotId}
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-8 py-3 rounded disabled:bg-gray-400"
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
