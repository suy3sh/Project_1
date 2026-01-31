package com.revature.smartAppointment.dto;

public record BookAppointmentRequestDto(
        Integer slotId,
        Integer patientId,
        Integer typeId
) {}
