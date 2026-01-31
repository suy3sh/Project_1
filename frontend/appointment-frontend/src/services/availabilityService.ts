import { DoctorAvailability } from "@/components/availability";
import { http } from "@/services/http";
import type { TimeSlot } from "@/types/slotTypes";

export type AvailabilityByDate = Record<string, DoctorAvailability[]>

export async function fetchAvailability(): Promise<AvailabilityByDate> {
  const { data } = await http.get<AvailabilityByDate>("/availability");
  return data;
}