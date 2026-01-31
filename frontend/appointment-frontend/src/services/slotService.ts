// src/services/slotService.ts
import { http } from "@/services/http";
import type { TimeSlot } from "@/types/slotTypes";

export async function fetchDoctorSlots(doctorId: number,date: string): Promise<TimeSlot[]> {
    const { data } = await http.get<TimeSlot[]>(`/slots/doctor/${doctorId}`,{params: { date },});
    return data;
}
