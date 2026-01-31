import { User } from "./userTypes";

export type Speciality = {
    description: string | null;
    specialityName: string | null;
    specialityId: number;
    appointmentTypes: AppointmentType[];
}

export type Doctor = {
    doctorId: number;
    bio: string | null;
    experienceYears: number | null;
    gender: string | null;
    speciality: Speciality | null;
    user: User;
}

export type AppointmentType = {
    typeId: number;
    name: string | null;
    estimatedTime: number | null;
    description: string | null;
}