package com.revature.smartAppointment.Controller;

import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.smartAppointment.Service.AvailabilityService;
import com.revature.smartAppointment.Service.AvailabilityWindowService;
import com.revature.smartAppointment.dto.DoctorAvailabilityDto;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/smart-appointment/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;
     
    @Autowired
    private AvailabilityWindowService availabilityWindowService;


     @Autowired
    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, List<DoctorAvailabilityDto>>> getAvailability() {
        Map<String, List<DoctorAvailabilityDto>> availability = availabilityWindowService.getAvailabilityByDate();
        return ResponseEntity.ok(availability);
    }
}
