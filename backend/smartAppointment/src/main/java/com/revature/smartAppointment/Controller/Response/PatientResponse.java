package com.revature.smartAppointment.Controller.Response;

import java.time.LocalDate;
import java.util.List;

import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Model.BloodType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private int patientId;
    private int age;
    private String gender;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;

    private boolean noAllergies;
    private String drugAllergies;

    private BloodType bloodType;
    private List<Allergy> allergies;
}
