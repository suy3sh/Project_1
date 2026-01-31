package com.revature.smartAppointment.dto;

import java.time.LocalDateTime;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;

public class DoctorAppointmentView {

    private String firstName;
    private String lastName;
    private Integer age;
    private LocalDateTime dateTimeScheduled;
    private AppointmentStatus status;

    public DoctorAppointmentView(String firstName, String lastName, Integer age,
                                 LocalDateTime dateTimeScheduled, AppointmentStatus status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.dateTimeScheduled = dateTimeScheduled;
        this.status = status;
    }

    // getters + setters
}
