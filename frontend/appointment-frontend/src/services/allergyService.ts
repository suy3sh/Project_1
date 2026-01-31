import { Allergy } from "@/types/patientTypes";
import { http } from "./http";

export async function getAllergies(): Promise<Allergy[]> {
    const {data} = await http.get<Allergy[]>("/allergies");
    return data;
}