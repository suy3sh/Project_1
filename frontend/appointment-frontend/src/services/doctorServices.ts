import { Doctor } from "@/types/doctorTypes";
import { http } from "./http";
import { getMyAppointments } from "@/services/appointmentServices";


export async function getMyDoctor(): Promise<Doctor> {
  const { data } = await http.get<Doctor>("/doctors/me");
  return data;
}

export async function getAllDoctors(signal?: AbortSignal): Promise<Doctor[]> {
  const { data } = await http.get("/doctors", { signal });
  return data;
}