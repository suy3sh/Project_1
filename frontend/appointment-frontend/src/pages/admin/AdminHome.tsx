import { useEffect, useMemo, useState } from "react";
import { TimeSlotCard, ScheduleDoctorForm } from "@/components/admin";
import { getAllDoctors } from "@/services/doctorServices";
import { useAuth } from "@/auth/useAuth";
import {
  AdminAppointment,
  AdminTimeSlot,
  AvailabilityWindow,
  createAvailabilityWindow,
  deleteAvailabilityWindow,
  denyAppointment,
  cancelAppointment,
  fetchAdminAppointments,
  fetchAdminTimeSlots,
  fetchAvailabilityWindows,
} from "@/services/adminService";
import { Doctor as DoctorModel } from "@/types/doctorTypes";

interface DoctorOption {
  id: number;
  name: string;
}

export default function AdminHome() {
  const { user } = useAuth();
  const admin = {
    name: user?.firstName || user?.lastName ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() : "Admin",
    contact: user?.email ?? "",
  };

  const [doctors, setDoctors] = useState<DoctorModel[]>([]);
  const [availabilityWindows, setAvailabilityWindows] = useState<AvailabilityWindow[]>([]);
  const [slots, setSlots] = useState<AdminTimeSlot[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  const doctorOptions = useMemo<DoctorOption[]>(
    () =>
      doctors.map((doctor) => ({
        id: doctor.doctorId,
        name: `${doctor.user.firstName} ${doctor.user.lastName}`,
      })),
    [doctors]
  );

  useEffect(() => {
    const controller = new AbortController();
    getAllDoctors(controller.signal)
      .then(setDoctors)
      .catch((error) => {
        console.error("AdminHome: failed to load doctors", error);
      });
    fetchAdminAppointments("ALL")
      .then(setAppointments)
      .catch((error) => {
        console.error("AdminHome: failed to load appointments", error);
      });
    fetchAdminTimeSlots()
      .then(setSlots)
      .catch((error) => {
        console.error("AdminHome: failed to load time slots", error);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (selectedDoctorId !== null || doctors.length === 0) return;
    const firstDoctorId = doctors[0].doctorId;
    setSelectedDoctorId(firstDoctorId);
    fetchAvailabilityWindows(firstDoctorId)
      .then(setAvailabilityWindows)
      .catch((error) => {
        console.error("AdminHome: failed to load availability windows", error);
      });
  }, [doctors, selectedDoctorId]);

  const handleScheduleSubmit = (
    doctorId: number,
    date: string,
    startTime: string,
    endTime: string
  ) => {
    createAvailabilityWindow(doctorId, { date, startTime, endTime })
      .then(() => Promise.all([
        fetchAvailabilityWindows(doctorId),
        fetchAdminTimeSlots(),
      ]))
      .then(([windows, timeSlots]) => {
        setAvailabilityWindows(windows);
        setSlots(timeSlots);
        setSelectedDoctorId(doctorId);
      })
      .catch((error) => {
        console.error("AdminHome: failed to create availability window", error);
      });
  };

  const handleDeleteWindow = (windowId: number) => {
    deleteAvailabilityWindow(windowId)
      .then(() => {
        if (!selectedDoctorId) return;
        return Promise.all([
          fetchAvailabilityWindows(selectedDoctorId),
          fetchAdminTimeSlots(),
        ]);
      })
      .then((result) => {
        if (!result) return;
        const [windows, timeSlots] = result;
        setAvailabilityWindows(windows);
        setSlots(timeSlots);
      })
      .catch((error) => {
        console.error("AdminHome: failed to delete availability window", error);
      });
  };

  const handleDoctorChange = (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    Promise.all([
      fetchAvailabilityWindows(doctorId),
      fetchAdminTimeSlots(),
    ])
      .then(([windows, timeSlots]) => {
        setAvailabilityWindows(windows);
        setSlots(timeSlots);
      })
      .catch((error) => {
        console.error("AdminHome: failed to update doctor view", error);
      });
  };

 const handleCancelAppointment = (appointmentId: number) => {
  cancelAppointment(appointmentId)
    .then(() => fetchAdminAppointments("ALL"))
    .then(setAppointments)
    .catch((error) => {
      console.error("AdminHome: failed to cancel appointment", error);
    });
};


  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Administrative Lead Profile Section */}
        <div className="rounded-2xl p-8 mb-8 shadow-sm bg-white">
          <div className="flex gap-8 items-start flex-wrap">
            {/* Admin Info */}
            <div className="flex-1 min-w-[300px]">
              <h1 className="m-0 mb-2 font-bold leading-tight text-slate-800 text-3xl">
                {admin.name}
              </h1>
              <p className="m-0 mb-6 font-medium text-slate-500 text-lg">
                {admin.contact}
              </p>
            </div>

            {/* Professional Image */}
            <div className="flex-shrink-0">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                aria-hidden="true"
              >
                <circle cx="100" cy="75" r="35" fill="white" opacity="0.9" />
                <ellipse cx="100" cy="140" rx="50" ry="35" fill="white" opacity="0.9" />
                {/* Simple laptop representation */}
                <rect
                  x="70"
                  y="60"
                  width="60"
                  height="40"
                  rx="2"
                  fill="white"
                  opacity="0.7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Schedule Doctor Section */}
        <ScheduleDoctorForm
          doctors={doctorOptions}
          onSubmit={handleScheduleSubmit}
          onDoctorChange={handleDoctorChange}
        />

        {/* Scheduled Time Slots Section */}
        <div className="mb-8">
          <h2 className="m-0 mb-6 font-bold text-slate-800 text-2xl">
            Availability Windows
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilityWindows.map((window) => (
              <TimeSlotCard
                key={window.windowId}
                id={window.windowId}
                doctorName={window.doctorName ?? "Unknown"}
                date={window.date}
                timeslot={`${window.startTime} - ${window.endTime}`}
                onDelete={handleDeleteWindow}
              />
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-8">
          <h2 className="m-0 mb-6 font-bold text-slate-800 text-2xl">
            Time Slots
          </h2>
          {slots.length === 0 ? (
            <p className="text-slate-500">No time slots found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <TimeSlotCard
                  key={slot.slotId}
                  id={slot.slotId}
                  doctorName={slot.doctorName ?? "Unknown"}
                  date={slot.dateAvailable}
                  timeslot={`${slot.startTime} - ${slot.endTime} (${slot.status})`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="mb-8">
          <h2 className="m-0 mb-6 font-bold text-slate-800 text-2xl">
            Appointments
          </h2>
          {appointments.length === 0 ? (
            <p className="text-slate-500">No appointments found.</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3">Patient</th>
                    <th className="text-left px-4 py-3">Doctor</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Time</th>
                    <th className="text-left px-4 py-3">Type</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.appointmentId} className="border-t border-slate-100">
                      <td className="px-4 py-3">{appt.patientName ?? "—"}</td>
                      <td className="px-4 py-3">{appt.doctorName ?? "—"}</td>
                      <td className="px-4 py-3">
                        {appt.dateAvailable ?? appt.scheduledDateTime?.split("T")[0] ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {appt.startTime && appt.endTime
                          ? `${appt.startTime} - ${appt.endTime}`
                          : appt.scheduledDateTime
                            ? appt.scheduledDateTime.split("T")[1]?.slice(0, 5) ?? "—"
                            : "—"}
                      </td>
                     <td className="px-4 py-3">
  {appt.appointmentType ?? "—"}
</td>
<td className="px-4 py-3">{appt.status}</td>
<td className="px-4 py-3">
  <button
    onClick={() => handleCancelAppointment(appt.appointmentId)}
    className="px-3 py-1 rounded-md text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60"
    disabled={appt.status === "CANCELLED"}
  >
    Cancel
  </button>
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Staff List lives in AdminStaffList only */}
      </div>
    </div>
  );
}
