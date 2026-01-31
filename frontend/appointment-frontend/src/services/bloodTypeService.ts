import { BloodType } from "@/types/patientTypes";
import { http } from "./http";

export async function getBloodType(): Promise<BloodType[]> {
    const {data} = await http.get<BloodType[]>("/blood-types");
    return data;
}