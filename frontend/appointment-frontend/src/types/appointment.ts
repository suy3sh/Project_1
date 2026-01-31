export type Appointment = {
  id?: number;
  __backendId?: number;
  patient_name?: string;
  appointment_type?: string;
  date?: string;      // YYYY-MM-DD
  time?: string;      // HH:MM
  scheduledDateTime?: string; // Add this to match backend
  estimatedDurationMinutes?: number;
  status?: string;
};