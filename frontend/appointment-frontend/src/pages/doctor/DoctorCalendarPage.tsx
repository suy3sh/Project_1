import { useEffect, useState } from "react";
import DoctorCalendar from "@/components/doctor/DoctorCalendar";
import { AppointmentType } from "@/types/doctorTypes";
import { getMyDoctor } from "@/services/doctorServices";
import { DoctorAppointmentView, fetchAllDoctorAppointments, updateAppointmentStatus } from "@/services/appointmentService";


export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointmentView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const me = await getMyDoctor();
        if (cancelled) return;
        setDoctorId(me.doctorId);

        const data = await fetchAllDoctorAppointments(me.doctorId);
        if (cancelled) return;
        setAppointments(data);

      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load appointments");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading appointments…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <DoctorCalendar
      title="Your Appointments"
      noAppointmentsMessage="No appointments scheduled"
      appointments={appointments}
      onUpdate={async (apt) => {
        if (doctorId == null) {
          return { isOk: false, message: "Doctor not loaded" };
        }

        try {
          const updated = await updateAppointmentStatus(
            doctorId,
            apt.appointmentId,
            apt.status
          );

          // Update UI using backend response (source of truth)
          setAppointments((prev) =>
            prev.map((a) =>
              a.appointmentId === updated.appointmentId ? updated : a
            )
          );

          return { isOk: true };
        } catch (err) {
          console.error(err);
          return { isOk: false, message: "Failed to update appointment status" };
        }
      }}
    />
  );
}
