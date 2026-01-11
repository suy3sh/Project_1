import { useEffect, useMemo, useState } from "react";

export default function DoctorCalendar({
  title = "Appointment Calendar",
  noAppointmentsMessage = "No appointments scheduled",
  appointments: appointmentsProp = [],
  onDelete = async () => ({ isOk: true }),
  onUpdate = async () => ({ isOk: true }),
}) {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null); // "YYYY-MM-DD" | null
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Editing state
  const [editingApt, setEditingApt] = useState(null);
  const [editForm, setEditForm] = useState({
    patient_name: "",
    appointment_type: "",
    date: "",
    time: "",
  });

  // UX state
  const [deleteBusyId, setDeleteBusyId] = useState(null);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [modalError, setModalError] = useState("");

  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const years = useMemo(() => {
    const start = currentYear - 5;
    return Array.from({ length: 10 }, (_, i) => start + i);
  }, [currentYear]);

  const firstDay = useMemo(() => new Date(currentYear, currentMonth, 1), [currentYear, currentMonth]);
  const lastDay = useMemo(() => new Date(currentYear, currentMonth + 1, 0), [currentYear, currentMonth]);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sun

  const appointments = useMemo(() => appointmentsProp ?? [], [appointmentsProp]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map();
    for (const apt of appointments) {
      if (!apt?.date) continue;
      const arr = map.get(apt.date) ?? [];
      arr.push(apt);
      map.set(apt.date, arr);
    }
    return map;
  }, [appointments]);

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDate) return [];
    const list = (appointmentsByDate.get(selectedDate) ?? []).slice();
    // Canva used localeCompare; keep same behavior (works best with "HH:MM")
    list.sort((a, b) => String(a.time || "").localeCompare(String(b.time || "")));
    return list;
  }, [appointmentsByDate, selectedDate]);

  // Close modal with Esc
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  function formatDateLong(dateStr) {
    // dateStr: YYYY-MM-DD
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function openDay(dateStr) {
    setModalError("");
    setEditingApt(null);
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingApt(null);
    setModalError("");
    setDeleteBusyId(null);
    setUpdateBusy(false);
  }

  function goPrevMonth() {
    setModalError("");
    setEditingApt(null);
    setSelectedDate(null);
    setIsModalOpen(false);

    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function goNextMonth() {
    setModalError("");
    setEditingApt(null);
    setSelectedDate(null);
    setIsModalOpen(false);

    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function beginEdit(apt) {
    setModalError("");
    setEditingApt(apt);
    setEditForm({
      patient_name: apt.patient_name ?? "",
      appointment_type: apt.appointment_type ?? "",
      date: apt.date ?? "",
      time: apt.time ?? "",
    });
  }

  async function handleDelete(apt) {
    setModalError("");
    setDeleteBusyId(apt.__backendId ?? apt.id ?? "busy");
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

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editingApt) return;

    setModalError("");
    setUpdateBusy(true);

    const updatedAppointment = {
      ...editingApt,
      patient_name: editForm.patient_name,
      appointment_type: editForm.appointment_type,
      date: editForm.date,
      time: editForm.time,
    };

    try {
      const result = await onUpdate(updatedAppointment);
      if (result?.isOk) {
        setEditingApt(null); // go back to list view
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
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-3">{title}</h1>
              <h3 className="m-0 mb-10 font-medium text-slate-500 text-lg">Handle and manage your appointments.</h3>

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={goPrevMonth}
                  className="px-4 py-2 rounded bg-slate-500 text-white font-medium text-sm hover:opacity-90 active:opacity-80"
                >
                  ← Previous
                </button>

                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="px-4 py-2 rounded border-2 border-slate-500/70 text-sm bg-white cursor-pointer"
                  aria-label="Select month"
                >
                  {monthNames.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="px-4 py-2 rounded border-2 border-slate-500/70 text-sm bg-white cursor-pointer"
                  aria-label="Select year"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={goNextMonth}
                  className="px-4 py-2 rounded bg-slate-500 text-white font-medium text-sm hover:opacity-90 active:opacity-80"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-3 text-center font-semibold text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Leading blanks */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square rounded bg-slate-50" />
              ))}

              {/* Days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(
                  2,
                  "0"
                )}`;
                const count = (appointmentsByDate.get(dateStr) ?? []).length;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => openDay(dateStr)}
                    className="calendar-day aspect-square bg-white border-2 border-slate-500/20 rounded p-2 text-left flex flex-col relative hover:-translate-y-0.5 hover:shadow-md transition-all"
                    aria-label={`Open appointments for ${dateStr}`}
                  >
                    <div className="font-semibold text-sm">{dayNum}</div>

                    {count > 0 && (
                      <div className="appointment-badge mt-auto px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold text-center">
                        {count} apt{count !== 1 ? "s" : ""}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50"
          onMouseDown={(e) => {
            // close when clicking overlay
            if (e.target === e.currentTarget) closeModal();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Appointments modal"
        >
          <div className="modal-content bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-xl animate-[slideUp_0.3s_ease]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">{formatDateLong(selectedDate)}</h2>
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
                      const id = apt.__backendId ?? apt.id ?? `${apt.date}-${apt.time}-${apt.patient_name}`;
                      const isDeleting = deleteBusyId === id;

                      return (
                        <div
                          key={id}
                          className="border-2 border-slate-500/20 rounded-md p-4 bg-white"
                        >
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <div>
                              <div className="font-semibold text-lg">{apt.patient_name}</div>
                              <div className="text-blue-500 text-sm font-medium">{apt.appointment_type}</div>
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

                          <div className="font-semibold text-sm">🕐 {apt.time}</div>
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

      {/* Keyframes to match Canva animations (optional) */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
