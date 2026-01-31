package com.revature.smartAppointment.dto;

import lombok.*;


@Data
public class SlotDto {

    private Integer slotId;
    private String startTime;
    private String endTime;
    private boolean available;

  // No-arg constructor
    public SlotDto() {
    }

    // All-args constructor
    public SlotDto(Integer slotId,String startTime, String endTime, boolean available) {
          this.slotId = slotId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = available;
    }

   // Getters and setters
}
