/* ================= TIME SLOT ================= */

export type TimeSlot = {
 slotId: number;
  startTime: string;
  endTime: string;
  available: boolean;
}

/* ================= DOCTOR AVAILABILITY ================= */

export type DoctorAvailability = {
   doctorId: number;       // <-- must match backend
  doctorName: string;     // <-- must match backend
  specialization: string;
  slots: TimeSlot[];
};
