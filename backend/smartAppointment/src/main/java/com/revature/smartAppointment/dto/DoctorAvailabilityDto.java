package com.revature.smartAppointment.dto;

import java.util.List;
import java.util.ArrayList;
import lombok.Data;

@Data
public class DoctorAvailabilityDto {
    private Integer doctorId;
    private String doctorName;
    private String specialization;
    private List<SlotDto> slots;

    // NO-ARG constructor
    public DoctorAvailabilityDto() {
        this.slots = new ArrayList<>();
    }

    // ALL-ARGS constructor
    public DoctorAvailabilityDto(Integer doctorId, String doctorName, String specialization, List<SlotDto> slots) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.slots = slots;
    }
}
