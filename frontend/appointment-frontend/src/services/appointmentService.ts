import { http } from "./http";

export type AppointmentDto = {
    appointmentId: number;
    doctorName: string;
    appointmentType: string;
    startTime: string; 
    endTime: string;   
    status: string;
};

export type DoctorAppointmentApi = {
    appointmentId: number;
    patientFirstName: string;
    patientLastName: string;
    appointmentType: string;
    scheduledDateTime: string; // ISO, e.g. "2026-01-24T09:00:00"
    status: string;           // "COMPLETED" | "CONFIRMED" | etc.
};

//thisis what the calendar expects
export type DoctorAppointmentView = {
    appointmentId: number,
    patientFirstName: string,
    patientLastName: string,
    appointmentType: string,
    date: string,
    time: string,
    status: string
};

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function isoToLocalDateAndTime(iso: string): { date: string; time: string } {
    // Expect "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm"
    const [ymd, hms] = iso.split("T");
    const [hh, mm] = (hms ?? "00:00").split(":");
    return {
        date: ymd,
        time: `${pad2(Number(hh))}:${pad2(Number(mm))}`,
    };
}

export async function fetchAppointmentsForPatient(patientId: number): Promise<AppointmentDto[]> {
    const {data} = await http.get<AppointmentDto[]>(`/appointments/patient/${patientId}`);

    return data;
}

export async function fetchAllDoctorAppointments(doctorId: number): Promise<DoctorAppointmentView[]>{
    const {data} = await http.get<DoctorAppointmentApi[]>(`/doctors/${doctorId}/appointments/all`)
    return data.map((a) => {
        const {date, time} = isoToLocalDateAndTime(a.scheduledDateTime);
        return {
            appointmentId: a.appointmentId,
            patientFirstName: a.patientFirstName,
            patientLastName: a.patientLastName,
            appointmentType: a.appointmentType,
            date,
            time,
            status: a.status,
        }
    })
}


export async function updateAppointmentStatus(doctorId: number, appointmentId: number, status: string){
    const {data} = await http.patch(`/doctors/${doctorId}/appointments/${appointmentId}/status`, {status});
    return data;
}

export const getMyAppointments = async () => {
  const { data } = await http.get("/doctors/me/appointments/today");
  return data;
};