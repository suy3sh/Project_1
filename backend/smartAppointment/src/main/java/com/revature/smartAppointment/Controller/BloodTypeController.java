package com.revature.smartAppointment.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.smartAppointment.Model.BloodType;
import com.revature.smartAppointment.Service.BloodTypeService;
import com.revature.smartAppointment.Util.JwtUtil;


@RestController
@RequestMapping("/smart-appointment/api/blood-types")
@CrossOrigin(origins = "http://localhost:5173")
public class BloodTypeController {
    private BloodTypeService bloodTypeService;
    private JwtUtil jwtUtil;

    @Autowired
    public BloodTypeController(BloodTypeService bloodTypeService, JwtUtil jwtUtil){
        this.bloodTypeService = bloodTypeService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<List<BloodType>> getBloodType(){
        return ResponseEntity.ok(bloodTypeService.findAll());
    }

    @GetMapping({"bloodType_id"})
    public ResponseEntity<BloodType> getBloodType(@RequestHeader("Authorization") String authHeader, @PathVariable int blood_type_id){
        try {
            String token = authHeader.substring(7); 

            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            return bloodTypeService.findById(blood_type_id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(404).build());

        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
