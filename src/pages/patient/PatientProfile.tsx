import React from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

interface Patient {
  name: string;
  age: number;
  gender: string;
  dob: string;
  bloodGroup: string;
  address: string;
  allergies: string;
  medicalHistory: string;
  lifestyle: string;
  photo: string;
}

interface Appointment {
  id: number;
  date: string;
  doctor: string;
  department: string;
  canRebook: boolean;
}

interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

interface ProfileItemProps {
  label: string;
  value: string;
}

/* ================= COMPONENT ================= */

const PatientProfile: React.FC = () => {
  const navigate = useNavigate();

  const patient: Patient = {
    name: "Jane Smith",
    age: 23,
    gender: "Female",
    dob: "03/04/2003",
    bloodGroup: "O+",
    address: "123 Green Street, New York",
    allergies: "Peanuts",
    medicalHistory: "No chronic illness",
    lifestyle: "Vegetarian, exercises regularly",
    photo: "https://i.pravatar.cc/150?img=47",
  };

  const appointments: Appointment[] = [
    {
      id: 1,
      date: "12 Jan 2026",
      doctor: "Dr. Ben Martinez",
      department: "Cardiology",
      canRebook: true,
    },
    {
      id: 2,
      date: "28 Dec 2025",
      doctor: "Dr. Samuel Chen",
      department: "General Medicine",
      canRebook: true,
    },
    {
      id: 3,
      date: "05 Dec 2025",
      doctor: "Dr. Leya Al-Sayed",
      department: "Pediatrics",
      canRebook: true,
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/patient")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-purple-700">
          Patient Profile
        </h2>

        <button
          onClick={() => navigate("/patient/profile/edit")}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          <img
            src={patient.photo}
            alt="Patient"
            className="w-32 h-32 rounded-full border-4 border-purple-200"
          />

          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800">
              {patient.name}
            </h3>
            <p className="text-gray-500">
              {patient.gender}, {patient.age} years
            </p>

            <div className="mt-3 inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full font-medium">
              Blood Group: {patient.bloodGroup}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ProfileCard title="Personal Information">
            <ProfileItem label="Date of Birth" value={patient.dob} />
            <ProfileItem label="Address" value={patient.address} />
          </ProfileCard>

          <ProfileCard title="Medical Information">
            <ProfileItem label="Allergies" value={patient.allergies} />
            <ProfileItem
              label="Medical History"
              value={patient.medicalHistory}
            />
            <ProfileItem label="Lifestyle" value={patient.lifestyle} />
          </ProfileCard>
        </div>

        {/* Appointment History */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            Previous Appointments
          </h3>

          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-purple-50 rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {appt.department}
                  </p>
                  <p className="text-sm text-gray-600">{appt.doctor}</p>
                  <p className="text-sm text-gray-500">{appt.date}</p>
                </div>

                <button
                  disabled={!appt.canRebook}
                  onClick={() =>
                    navigate("/patient/book", {
                      state: {
                        doctorId: appt.id, 
                        doctor: appt.doctor,
                        department: appt.department,
                        date: appt.date,
                      },
                    })
                  }
                  className={`mt-3 md:mt-0 px-5 py-2 rounded-lg font-medium transition ${
                    appt.canRebook
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Rebook
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <div className="bg-purple-50 rounded-xl p-4">
      <h4 className="text-lg font-semibold text-purple-700 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ProfileItem({ label, value }: ProfileItemProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

export default PatientProfile;
