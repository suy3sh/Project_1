import { http } from "./http";
import { Speciality, User, CreateUserPayload, PatchDoctorResponse} from "@/types/superTypes";
import { RegisterUserRequest, RegisterResponse } from "@/types/userTypes";

export async function getSpecialities(): Promise<Speciality[]> {
    const {data} = await http.get<Speciality[]>("/specialities");
    return data;
}

export async function getUsersForTable(): Promise<User[]> {
    const {data} = await http.get<User[]>("/users/table");
    return data;
}

export async function registerUser(payload: CreateUserPayload): Promise<RegisterResponse> {
    const userPayload: RegisterUserRequest = {firstName: payload.firstName, lastName: payload.lastName, email: payload.email, password: payload.password, privilegeId: 0}
    
    if (payload.privilege === "Doctor") {
        userPayload.privilegeId = 2;
    } else if (payload.privilege === "Admin") {
        userPayload.privilegeId = 3;
    } else if (payload.privilege === "Super") {
        userPayload.privilegeId = 4;
    }

    const {data} = await http.post<RegisterResponse>(`/auth/register`, userPayload);
    return data;
}

export async function patchDoctor(userID: number, payload: CreateUserPayload): Promise<PatchDoctorResponse> {
    const doctorPayload = {gender: payload.gender, speciality: payload.speciality, experience: payload.experience, bio: payload.bio}
    
    const {data} = await http.patch<PatchDoctorResponse>(`/doctors/${userID}`, doctorPayload);
    return data;
}

export async function patchUser(userID: number, payload: CreateUserPayload): Promise<User> {
    const userPayload = {firstName: payload.firstName, lastName: payload.lastName, email: payload.email}
    
    const {data} = await http.patch<User>(`/users/${userID}`, userPayload);
    return data;
}

export async function deleteUser(userID: number): Promise<User> {
    const {data} = await http.delete<User>(`/users/${userID}`);
    return data;
}