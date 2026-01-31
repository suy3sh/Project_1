
import { PatchPatientRequest, PatchPatientResponse, Patient } from "@/types/patientTypes";
import { http } from "./http";

export async function patchPatient(userID: number, payload: PatchPatientRequest) : Promise<PatchPatientResponse> {
    const {data} = await http.patch<PatchPatientResponse>(`/patients/${userID}`, payload);
    return data;
}

export async function getMyPatient(): Promise<Patient>{
    const {data} = await http.get("/patients/me");
    return data;
}