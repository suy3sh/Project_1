package com.revature.smartAppointment.Controller.Response;

import com.revature.smartAppointment.Model.Privilege;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private Integer userId;
    private String email;
    private Privilege privilege;
}
