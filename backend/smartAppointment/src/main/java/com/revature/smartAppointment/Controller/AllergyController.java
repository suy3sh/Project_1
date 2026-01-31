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

import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Service.AllergyService;
import com.revature.smartAppointment.Util.JwtUtil;

@RestController
@RequestMapping("/smart-appointment/api/allergies")
@CrossOrigin(origins = "http://localhost:5173")
public class AllergyController {
    private AllergyService allergyService;
    private JwtUtil jwtUtil;

    @Autowired
    public AllergyController(AllergyService allergyService, JwtUtil jwtUtil) {
        this.allergyService = allergyService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<List<Allergy>> getAllergies(){
        return ResponseEntity.ok(allergyService.findAll());
    }

    @GetMapping("/{allergy_id}")
    public ResponseEntity<Allergy> getAllergy(@RequestHeader("Authorization") String authHeader, @PathVariable int allergy_id) {
        try {
            String token = authHeader.substring(7); 

            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            return allergyService.findById(allergy_id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(404).build());

        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

}
