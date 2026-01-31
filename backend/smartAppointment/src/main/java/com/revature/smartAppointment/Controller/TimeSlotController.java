package com.revature.smartAppointment.Controller;

import com.revature.smartAppointment.dto.SlotDto;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.TimeSlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/smart-appointment/api/slots")
@CrossOrigin(origins = "http://localhost:5173")
public class TimeSlotController {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @GetMapping("/doctor/{doctorId}")
    public List<SlotDto> getDoctorSlotsByDate(
            @PathVariable Integer doctorId,
            @RequestParam String date
    ) {
        LocalDate localDate = LocalDate.parse(date);

        return timeSlotRepository
                .findByDoctor_DoctorIdAndDateAvailableAndStatusOrderByStartTimeAsc(
                        doctorId,
                        localDate,
                        TimeSlotStatus.AVAILABLE
                )
                .stream()
                .map(slot -> {
                SlotDto dto = new SlotDto();
                dto.setSlotId(slot.getSlotId());
                dto.setStartTime(slot.getStartTime().toString());
                dto.setEndTime(slot.getEndTime().toString());
                dto.setAvailable(slot.getStatus() == TimeSlotStatus.AVAILABLE);
                return dto;
            })
            .toList();
    }
}
