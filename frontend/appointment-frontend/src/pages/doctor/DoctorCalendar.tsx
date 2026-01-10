import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/dist/shared/types";

// ---------- Types ----------
type ActionResult = { isOk: boolean; message?: string };

type Appointment = {
  id?: number;
  __backendId?: number;
  patient_name?: string;
  appointment_type?: string;
  date?: string; // "YYYY-MM-DD"
  time?: string; // "HH:MM"
  [key: string]: unknown;
};

type Props = {
  title?: string;
  noAppointmentsMessage?: string;
  appointments?: Appointment[] | null;
  onDelete?: (apt: Appointment) => Promise<ActionResult>;
  onUpdate?: (apt: Appointment) => Promise<ActionResult>;
};

type EditFormState = {
  patient_name: string;
  appointment_type: string;
  date: string;
  time: string;
};

// ---------- Helpers ----------
function toYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateLongFromYMD(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DoctorCalendar({
  title = "Appointment Calendar",
  noAppointmentsMessage = "No appointments scheduled",
  appointments: appointmentsProp = [],
  onDelete = async () => ({ isOk: true }),
  onUpdate = async () => ({ isOk: true }),
}: Props) {
  const appointments = useMemo<Appointment[]>(() => appointmentsProp ?? [], [appointmentsProp]);

  // Store selected date as a Date (react-calendar is Date-based)
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Editing state
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    patient_name: "",
    appointment_type: "",
    date: "",
    time: "",
  });

  // UX state
  const [deleteBusyId, setDeleteBusyId] = useState<number | null>(null);
  const [updateBusy, setUpdateBusy] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");

  const selectedDateYMD = useMemo(() => (selectedDateObj ? toYMD(selectedDateObj) : null), [selectedDateObj]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const apt of appointments) {
      if (!apt?.date) continue;
      const arr = map.get(apt.date) ?? [];
      arr.push(apt);
      map.set(apt.date, arr);
    }
    return map;
  }, [appointments]);

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDateYMD) return [];
    const list = (appointmentsByDate.get(selectedDateYMD) ?? []).slice();
    list.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
    return list;
  }, [appointmentsByDate, selectedDateYMD]);

  function closeModal() {
    setIsModalOpen(false);
    setEditingApt(null);
    setModalError("");
    setDeleteBusyId(null);
    setUpdateBusy(false);
  }

  // Close modal with Esc
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  // react-calendar onChange typing-safe handler
  function onCalendarChange(value: Value) {
    if (value instanceof Date) {
      setSelectedDateObj(value);
      return;
    }
    if (Array.isArray(value) && value[0] instanceof Date) {
      // If range mode ever gets enabled, keep start date
      setSelectedDateObj(value[0]);
      return;
    }
    setSelectedDateObj(null);
  }

  function openDay(date: Date) {
    setModalError("");
    setEditingApt(null);
    setSelectedDateObj(date);
    setIsModalOpen(true);
  }

  function beginEdit(apt: Appointment) {
    setModalError("");
    setEditingApt(apt);
    setEditForm({
      patient_name: apt.patient_name ?? "",
      appointment_type: apt.appointment_type ?? "",
      date: apt.date ?? "",
      time: apt.time ?? "",
    });
  }

  async function handleDelete(apt: Appointment) {
    setModalError("");

    const busyId = apt.__backendId ?? apt.id ?? 0;
    setDeleteBusyId(busyId);

    try {
      const result = await onDelete(apt);
      if (!result?.isOk) {
        setModalError("Failed to delete. Please try again.");
      }
    } catch {
      setModalError("Failed to delete. Please try again.");
    } finally {
      setDeleteBusyId(null);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingApt) return;

    setModalError("");
    setUpdateBusy(true);

    const updatedAppointment: Appointment = {
      ...editingApt,
      patient_name: editForm.patient_name,
      appointment_type: editForm.appointment_type,
      date: editForm.date,
      time: editForm.time,
    };

    try {
      const result = await onUpdate(updatedAppointment);
      if (result?.isOk) {
        setEditingApt(null);
      } else {
        setModalError("Failed to update appointment. Please try again.");
      }
    } catch {
      setModalError("Failed to update appointment. Please try again.");
    } finally {
      setUpdateBusy(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">
      <div className="w-full h-full p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-3">{title}</h1>
              <h3 className="m-0 mb-6 font-medium text-slate-500 text-lg">Handle and manage your appointments.</h3>
            </div>

            {/* React Calendar */}
            <div className="rounded-lg border border-slate-200 p-3">
              <Calendar
                value={selectedDateObj}
                onChange={onCalendarChange}
                onClickDay={openDay}
                selectRange={false}
                // Show an appointment count badge inside each day tile
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;
                  const key = toYMD(date);
                  const count = appointmentsByDate.get(key)?.length ?? 0;
                  if (count === 0) return null;

                  return (
                    <div className="mt-1 flex justify-center">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-semibold">
                        {count}
                      </span>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDateYMD && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50"
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Appointments modal"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-xl animate-[slideUp_0.3s_ease]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">{formatDateLongFromYMD(selectedDateYMD)}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-2xl leading-none px-2 py-1 hover:opacity-70"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {modalError && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                {modalError}
              </div>
            )}

            {/* Edit Form */}
            {editingApt ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div>
                  <label className="block font-medium mb-2 text-sm">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.patient_name}
                    onChange={(e) => setEditForm((f) => ({ ...f, patient_name: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-slate-500/30 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-sm">Appointment Type</label>
                  <input
                    type="text"
                    required
                    value={editForm.appointment_type}
                    onChange={(e) => setEditForm((f) => ({ ...f, appointment_type: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-slate-500/30 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-sm">Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-slate-500/30 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-sm">Time</label>
                  <input
                    type="time"
                    required
                    value={editForm.time}
                    onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-slate-500/30 rounded bg-white"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="flex-1 py-3 rounded bg-slate-500 text-white font-medium hover:opacity-90 disabled:opacity-60"
                    disabled={updateBusy}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded bg-blue-500 text-white font-medium hover:opacity-90 disabled:opacity-60"
                    disabled={updateBusy}
                  >
                    {updateBusy ? "Updating..." : "Update Appointment"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Appointment list */}
                {selectedDayAppointments.length === 0 ? (
                  <p className="text-slate-500 text-center py-10">{noAppointmentsMessage}</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {selectedDayAppointments.map((apt) => {
                      const id = apt.__backendId ?? apt.id ?? 0;
                      const isDeleting = deleteBusyId === id;

                      // If id is missing, use a deterministic fallback key
                      const key = id ? String(id) : `${apt.date}-${apt.time}-${apt.patient_name}`;

                      return (
                        <div key={key} className="border-2 border-slate-500/20 rounded-md p-4 bg-white">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <div>
                              <div className="font-semibold text-lg">{String(apt.patient_name ?? "")}</div>
                              <div className="text-blue-500 text-sm font-medium">
                                {String(apt.appointment_type ?? "")}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => beginEdit(apt)}
                                className="px-3 py-2 rounded bg-slate-500 text-white text-xs hover:opacity-90"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(apt)}
                                disabled={isDeleting}
                                className="px-3 py-2 rounded bg-red-500 text-white text-xs hover:opacity-90 disabled:opacity-60"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </div>

                          <div className="font-semibold text-sm">🕐 {String(apt.time ?? "")}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Optional: make react-calendar blend better with Tailwind layouts */
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}