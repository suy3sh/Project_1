package com.revature.smartAppointment.Controller.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorInfoRequest {
    private String gender;
    private String speciality;
    private int experience;
    private String bio;
}
