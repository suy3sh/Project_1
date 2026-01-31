package com.revature.smartAppointment.Controller.Request;

import java.time.LocalDate;
import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Model.BloodType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientInfoRequest {
    private int age;
    private String gender;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String address;
    private String bloodType;
    private String[] allergies;
    // NEW FIELDS
    private boolean noAllergies;
    private String drugAllergies;
   
}
