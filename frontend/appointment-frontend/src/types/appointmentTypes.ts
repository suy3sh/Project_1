// src/types/appointmentTypes.ts
export interface AppointmentDto {
  appointmentId: number;
  doctorName: string;
  appointmentType: string;
  startTime: string; // Backend sends ISO string
  endTime: string;   // Backend sends ISO string
  status: string;    // "CONFIRMED", "CANCELLED", etc.
}

export type Appointment = {
  appointmentId: number,
  doctorName: string,
  appointmentType: string,
  startTime: string,
  endTime: string,
  status: string
};

export interface AppointmentTypeObj {
  name: string;
}
