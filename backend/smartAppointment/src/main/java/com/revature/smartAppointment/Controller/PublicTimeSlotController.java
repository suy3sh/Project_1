package com.revature.smartAppointment.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.revature.smartAppointment.Service.TimeSlotService;

@RestController
@RequestMapping("/smart-appointment/api/public/time-slots")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicTimeSlotController {

    private final TimeSlotService timeSlotService;

    public PublicTimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    @GetMapping
    public ResponseEntity<List<TimeSlotService.PublicTimeSlotView>> getAvailableSlots(
            @RequestParam(required = false) Integer doctorId,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        List<TimeSlotService.PublicTimeSlotView> slots = timeSlotService.getAvailableSlotsPublic(doctorId, date, from, to);
        return ResponseEntity.ok(slots);
    }
}
