package com.revature.smartAppointment.dto;

import java.time.LocalDateTime;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;

public record AppointmentDto(
    Integer appointmentId,
    String doctorName,
    String appointmentType,
    //LocalDateTime dateTimeScheduled,
    LocalDateTime startTime,
    LocalDateTime endTime,
    AppointmentStatus status
) {



    
}
