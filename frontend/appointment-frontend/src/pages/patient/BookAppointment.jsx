import { useState } from "react";


function BookAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);

  const doctors = [
    { id: 1, name: "Dr. Olivia Martinez", specialty: "Primary Care" },
    { id: 2, name: "Dr. Priya Patel", specialty: "OB-GYN" },
    { id: 3, name: "Dr. Layal Al-Sayed", specialty: "Cardiology" },
  ];

  const appointmentTypes = [
    "Physical Examination",
    "General Checkup",
    "Vaccination",
    "Health Consultation",
  ];

  return (
    <div className="min-h-screen bg-[#f7faef] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center mb-1">
          Book an Appointment
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select a doctor and choose your appointment
        </p>

        {/* STEP 1: SELECT DOCTOR */}
        <h2 className="font-semibold mb-3">1. Select a Doctor</h2>
        <div className="space-y-3 mb-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => setSelectedDoctor(doctor.id)}
              className={`border rounded p-4 cursor-pointer flex justify-between items-center
                ${
                  selectedDoctor === doctor.id
                    ? "border-green-600 bg-green-50"
                    : "hover:border-gray-400"
                }`}
            >
              <div>
                <p className="font-medium">{doctor.name}</p>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* STEP 2: APPOINTMENT TYPE */}
        <h2 className="font-semibold mb-3">2. Select Appointment Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {appointmentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setAppointmentType(type)}
              className={`border rounded p-3 text-left
                ${
                  appointmentType === type
                    ? "border-green-600 bg-green-50"
                    : "hover:border-gray-400"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* STEP 3: DATE & TIME (PLACEHOLDER) */}
        <h2 className="font-semibold mb-3">3. Select Date & Time</h2>
        <div className="border rounded p-6 text-gray-500 mb-8 text-center">
          Calendar & time picker will go here
        </div>

        {/* SUBMIT */}
        <div className="text-center">
          <button
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
            onClick={() => alert("Appointment booked (demo)")}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
