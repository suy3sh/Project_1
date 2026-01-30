import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPatient } from "@/services/patientServices";
import { Patient } from "@/types/patientTypes";
import { fetchAppointmentsForPatient } from "@/services/appointmentService";
import { Appointment } from "@/types/appointmentTypes";

function PatientProfile() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getMyPatient();

        if (!cancelled) setPatient(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load profile");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!patient) return;

    let cancelled = false;

    (async () => {
      try {
        const allAppointments = await fetchAppointmentsForPatient(patient.patientId);
        if (cancelled) return;

        const completedAppointments = allAppointments.filter(
          (appt) => appt.status === "COMPLETED"
        );

        setAppointments(completedAppointments);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load appointment history");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patient]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!patient) return <p>Loading profile...</p>;

  // Allergies display
  const allergyDisplay = (() => {
    if (patient.noAllergies) return "None";

    const allergyNames = patient.allergies?.length
      ? patient.allergies.map((a) => a.name).join(", ")
      : "";

    const drugText = patient.drugAllergies?.trim();

    if (allergyNames && drugText) return `${allergyNames} | Drug Allergies: ${drugText}`;
    if (drugText) return `Drug Allergies: ${drugText}`;
    if (allergyNames) return allergyNames;

    return "None";
  })();

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/patient/home")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          ← Back
        </button>

        <h2 className="text-4xl font-bold text-purple-700">Patient Profile</h2>

        <button
          onClick={() => navigate("/patient/profile/edit", { state: { patient } })}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 border-b pb-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800">
              {patient.user?.firstName ?? "N/A"} {patient.user?.lastName ?? ""}
            </h3>
            <p className="text-gray-500">
              {patient.gender
                ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                : "—"}, {patient.age ?? "—"} years
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ProfileCard title="Personal Information">
            <ProfileItem label="Date of Birth" value={patient.dateOfBirth ?? "-"} />
            <ProfileItem label="Address" value={patient.address ?? "-"} />
            <ProfileItem label="Phone Number" value={patient.phoneNumber ?? "-"} />
          </ProfileCard>

          <ProfileCard title="Medical Information">
            <ProfileItem label="Allergies" value={allergyDisplay} />
            <ProfileItem label="Blood Type" value={patient.bloodType?.name ?? "-"} />
          </ProfileCard>
        </div>

        {/* Appointment History */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            Previous Appointments
          </h3>

          {appointments.length === 0 ? (
            <div className="bg-purple-50 rounded-xl p-4 text-gray-600">
              No completed appointments yet.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt.appointmentId} className="bg-purple-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800">{appt.doctorName ?? "—"}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span> {appt.appointmentType ?? "—"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Date:</span>{" "}
                    {appt.startTime ? new Date(appt.startTime).toLocaleDateString("en-US") : "—"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Time:</span>{" "}
                    {appt.startTime
                      ? new Date(appt.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-purple-50 rounded-xl p-4">
      <h4 className="text-lg font-semibold text-purple-700 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-800">{value ?? "-"}</span>
    </div>
  );
}

export default PatientProfile;
