package com.revature.smartAppointment.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.smartAppointment.Controller.Response.SpecialityResponse;
import com.revature.smartAppointment.Model.Speciality;
import com.revature.smartAppointment.Service.SpecialityService;

@RestController
@RequestMapping("/smart-appointment/api/specialities")
@CrossOrigin(origins = "http://localhost:5173")
public class SpecialityController {
    private SpecialityService specialityService;

    @Autowired
    public SpecialityController(SpecialityService specialityService) {
        this.specialityService = specialityService;
    }

    @GetMapping()
    public ResponseEntity<List<SpecialityResponse>> getAllSpecialities() {
        List<Speciality> specialities = specialityService.findAll();
        List<SpecialityResponse> responses = new ArrayList<>();
        for (Speciality speciality : specialities) {
            responses.add(new SpecialityResponse(speciality.getSpecialityId(), speciality.getSpecialityName()));
        }
        
        return ResponseEntity.ok(responses);
    }
}
