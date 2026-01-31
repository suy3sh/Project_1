import { DoctorAppointmentView } from "@/services/appointmentService";
import { AppointmentType } from "@/types/doctorTypes";
import { formatTime } from "@/utils/validators";
import React, { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "react-calendar/dist/shared/types";

type ActionResult = { isOk: boolean; message?: string };

type Props = {
  title?: string;
  noAppointmentsMessage?: string;
  appointments?: DoctorAppointmentView[] | null;
  onUpdate?: (apt: DoctorAppointmentView) => Promise<ActionResult>;
};

type EditFormState = {
  status: string;
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

function statusPillClass(status: string) {
  const s = status?.toUpperCase?.() ?? status;
  if (s === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "CONFIRMED") return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === "PENDING") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function DoctorCalendar({
  title = "Appointment Calendar",
  noAppointmentsMessage = "No appointments scheduled",
  appointments: appointmentsProp = [],
  onUpdate = async () => ({ isOk: true }),
}: Props) {
  const appointments = useMemo<DoctorAppointmentView[]>(() => appointmentsProp ?? [], [appointmentsProp]);

  // Store selected date as a Date (react-calendar is Date-based)
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Editing state
  const [editingApt, setEditingApt] = useState<DoctorAppointmentView | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({status: ""});

  // UX state
  const [updateBusy, setUpdateBusy] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");

  const selectedDateYMD = useMemo(() => (selectedDateObj ? toYMD(selectedDateObj) : null), [selectedDateObj]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, DoctorAppointmentView[]>();
    for (const apt of appointments) {
      if (!apt?.date) continue;
      const list = map.get(apt.date) ?? [];
      list.push(apt);
      map.set(apt.date, list);
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
    setUpdateBusy(false);
  }

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

  function beginEdit(apt: DoctorAppointmentView) {
    setModalError("");
    setEditingApt(apt);
    setEditForm({ status: apt.status ?? "" })
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingApt) return;

    setModalError("");
    setUpdateBusy(true);

    const updatedAppointment: DoctorAppointmentView = {
      ...editingApt,
      status: editForm.status,
    };

    try {
      const result = await onUpdate(updatedAppointment);

      if (result?.isOk) {
        // Update local UI immediately (no refetch required)
        // Note: this assumes you keep appointments in parent OR inside this component.
        // If appointments are controlled by parent, do it in the parent (recommended).
        setEditingApt(null);
      } else {
        setModalError(result?.message || "Failed to update status. Please try again.");
      }
    } catch {
      setModalError("Failed to update status. Please try again.");
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
                <h3 className="m-0 mb-6 font-medium text-slate-500 text-lg">
                  Handle and manage your appointments.
                </h3>
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
                    <div>
                      <label className="block font-medium mb-2 text-sm">Patient Name</label>
                      <div className="w-full px-3 py-2 border-2 border-slate-500/20 rounded bg-slate-50 text-slate-700">
                        {editingApt
                          ? `${editingApt.patientFirstName} ${editingApt.patientLastName}`
                          : "-"}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-2 text-sm">Appointment Type</label>
                      <div className="w-full px-3 py-2 border-2 border-slate-500/20 rounded bg-slate-50 text-slate-700">
                        {editingApt?.appointmentType ?? "-"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium mb-2 text-sm">Date</label>
                        <div className="w-full px-3 py-2 border-2 border-slate-500/20 rounded bg-slate-50 text-slate-700">
                          {editingApt?.date ?? "-"}
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium mb-2 text-sm">Time</label>
                        <div className="w-full px-3 py-2 border-2 border-slate-500/20 rounded bg-slate-50 text-slate-700">
                          {editingApt?.time ?? "-"}
                        </div>
                      </div>
                    </div>                    
                    <label className="block font-medium mb-2 text-sm">Status</label>


                    <select
                      required
                      value={editForm.status}
                      onChange={(e) => setEditForm({ status: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-slate-500/30 rounded bg-white"
                    >
                      <option value="" disabled>Select status</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="DENIED">DENIED</option>
                      <option value="NO_SHOW">NO SHOW</option>
                    </select>
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
                      {updateBusy ? "Saving..." : "Save Status"}
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
                        const fullName = `${apt.patientFirstName} ${apt.patientLastName}`.trim();

                        return (
                          <div
                            key={String(apt.appointmentId)}
                            className="border-2 border-slate-500/20 rounded-md p-4 bg-white"
                          >
                            <div className="flex justify-between items-start gap-3 mb-2">
                              <div className="min-w-0">
                                <div className="font-semibold text-lg truncate">{fullName}</div>
                                <div className="text-blue-500 text-sm font-medium truncate">{apt.appointmentType}</div>

                                <div className="mt-2 flex items-center gap-2">
                                  <div className="font-semibold text-sm">🕐 {formatTime(apt.time)}</div>
                                  <span
                                    className={`text-[11px] px-2 py-0.5 rounded-full border ${statusPillClass(apt.status)}`}
                                  >
                                    {apt.status}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => beginEdit(apt)}
                                  className="px-3 py-2 rounded bg-slate-500 text-white text-xs hover:opacity-90"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
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

          .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
          }
        `}</style>
      </div>
    );
  }
