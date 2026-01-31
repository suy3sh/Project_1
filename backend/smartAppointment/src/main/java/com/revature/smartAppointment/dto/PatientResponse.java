package com.revature.smartAppointment.dto;

import java.time.LocalDate;
import java.util.List;

import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Model.BloodType;

import lombok.Data;

@Data
public class PatientResponse {
    private Integer patientId;
    private Integer age;
    private String gender;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;

    private boolean noAllergies;
    private String drugAllergies;

    private BloodType bloodType; // could be just name or whole object
    private List<Allergy> allergies; // list of allergy objects

    // Optional: you can include user info if needed
    // private UserResponse user;
}
