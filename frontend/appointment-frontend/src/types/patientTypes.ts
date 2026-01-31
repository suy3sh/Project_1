import { Privilege, User } from "./userTypes";

export type Patient = {
    patientId: number;
    address: string | null;
    age: number | null;
    bloodType: BloodType | null;
    dateOfBirth: string | null;
    gender: string | null;
    phoneNumber: string | null;
    allergies: Allergy[];
     noAllergies: boolean;
    drugAllergies: string | null;
    user: User;
}

export type BloodType = {
    bloodTypeId: number;
    name: string;
};

export type Allergy = {
    allergyId: number;
    name: string;
};

export type PatchPatientRequest = {
    address: string;
    age: number;
    allergies: string[]; 
    bloodType: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    phoneNumber: string;
    noAllergies: boolean;
  drugAllergies: string;
};

export type PatchPatientResponse = {
    patientId: number;
    address: string;
    age: number;
    allergies: Allergy[];
   
    bloodType: BloodType;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    user: {
        userId: number;
        email: string;
        firstName: string;
        lastName: string;
        privilege: Privilege;
        password?: string;
    };
};

export type PatientDetailsForm = {
    address: string;
    gender: "male" | "female" | "other";
    phoneNumber: string;
    dateOfBirth: string;
    bloodType: string;      
    allergyIds: number[];   //checkbox
    noAllergies: boolean;       // "No allergies" checkbox
    drugAllergies: string;      // free text for drug allergies
};

export type PatientEditForm = {
  patientId: number;
  address: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  bloodType: string;
  allergyIds: number[];
  noAllergies: boolean;
  drugAllergies: string;
};