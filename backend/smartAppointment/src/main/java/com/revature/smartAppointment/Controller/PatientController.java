/*package com.revature.smartAppointment.Controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.revature.smartAppointment.Mapper.PatientMapper;
import com.revature.smartAppointment.dto.PatientResponse;

import com.revature.smartAppointment.Controller.Request.PatientInfoRequest;
//import com.revature.smartAppointment.Controller.Response.PatientResponse;
import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Service.PatientService;
import com.revature.smartAppointment.Util.JwtUtil;
import com.revature.smartAppointment.dto.AppointmentDto;

@RestController
@RequestMapping("/smart-appointment/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {
    private final PatientService patientService;
     private final PatientMapper patientMapper;
    private final JwtUtil jwtUtil;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    public PatientController(PatientService patientService, PatientMapper patientMapper, JwtUtil jwtUtil) {
        this.patientService = patientService;
        this.jwtUtil = jwtUtil;
        this.patientMapper = patientMapper;

    }
     
    @GetMapping("{patientId}/appointments")
public List<AppointmentDto> getPatientAppointments(@PathVariable Integer patientId) {
    List<Appointment> appointments = appointmentRepository.findByPatient_PatientIdAndStatus(patientId, AppointmentStatus.CONFIRMED);

    return appointments.stream().map(appt -> new AppointmentDto(
            appt.getAppointmentId(),
            appt.getDoctor().getUser().getFirstName() + " " + appt.getDoctor().getUser().getLastName(),
            appt.getAppointmentType().getName(),
            appt.getDateTimeScheduled(),
            appt.getDateTimeScheduled().plusMinutes(30),
            appt.getStatus()
    )).collect(Collectors.toList());
}

    @GetMapping()
    public ResponseEntity<List<Patient>> getPatients() {
        return ResponseEntity.ok(patientService.findAll());
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<Patient> getPatient(@RequestHeader("Authorization") String authHeader, @PathVariable int user_id) {
        try {
            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            String privilege = jwtUtil.extractPrivilege(token);
            if ((privilege.equals("Patient") && jwtUtil.extractId(token) == user_id) || privilege.equals("Doctor")) {
                Optional<Patient> optionalPatient = patientService.findByUserId(user_id);
                if (optionalPatient.isPresent()) {
                    return ResponseEntity.ok(optionalPatient.get());
                }
                return ResponseEntity.status(400).build();
            } else {
                throw new RuntimeException("Invalid token");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    
@GetMapping("/me")
public ResponseEntity<PatientResponse> getMyPatient(@RequestHeader("Authorization") String authHeader) {
    try {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (!privilege.equals("Patient")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        int userId = jwtUtil.extractId(token);

        Patient patient = patientService.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return ResponseEntity.ok(patientMapper.toResponse(patient));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}



 @PatchMapping("/{user_id}")
public ResponseEntity<PatientResponse> updatePatient(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable int user_id,
        @RequestBody PatientInfoRequest patientInfo) {

    try {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (!privilege.equals("Patient") || jwtUtil.extractId(token) != user_id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Patient updatedPatient = patientService.updatePatientByUserId(user_id, patientInfo);
        return ResponseEntity.ok(patientMapper.toResponse(updatedPatient));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}


}*/


package com.revature.smartAppointment.Controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.smartAppointment.Mapper.PatientMapper;
import com.revature.smartAppointment.Controller.Request.PatientInfoRequest;
import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Service.PatientService;
import com.revature.smartAppointment.Util.JwtUtil;
import com.revature.smartAppointment.dto.PatientResponse;
import com.revature.smartAppointment.dto.AppointmentDto;

@RestController
@RequestMapping("/smart-appointment/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;
    private final PatientMapper patientMapper;
    private final JwtUtil jwtUtil;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    public PatientController(PatientService patientService, PatientMapper patientMapper, JwtUtil jwtUtil) {
        this.patientService = patientService;
        this.patientMapper = patientMapper;
        this.jwtUtil = jwtUtil;
    }

    // -------------------------
    // GET /patients
    // -------------------------
    @GetMapping()
    public ResponseEntity<List<PatientResponse>> getPatients() {
        List<Patient> patients = patientService.findAll();
        List<PatientResponse> response = patients.stream()
                .map(patientMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // -------------------------
    // GET /patients/{userId}
    // -------------------------
    @GetMapping("/{userId}")
    public ResponseEntity<PatientResponse> getPatient(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int userId) {
        try {
            String token = extractToken(authHeader);

            if (!jwtUtil.validateToken(token)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String privilege = jwtUtil.extractPrivilege(token);
            if ((privilege.equals("Patient") && jwtUtil.extractId(token) == userId) || privilege.equals("Doctor")) {
                Optional<Patient> optionalPatient = patientService.findByUserId(userId);
                return optionalPatient
                        .map(patientMapper::toResponse)
                        .map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // -------------------------
    // GET /patients/me
    // -------------------------
    @GetMapping("/me")
    public ResponseEntity<PatientResponse> getMyPatient(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = extractToken(authHeader);

            if (!jwtUtil.validateToken(token)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String privilege = jwtUtil.extractPrivilege(token);
            if (!privilege.equals("Patient")) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

            int userId = jwtUtil.extractId(token);
            Patient patient = patientService.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            return ResponseEntity.ok(patientMapper.toResponse(patient));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // -------------------------
    // PATCH /patients/{userId}
    // -------------------------
    @PatchMapping("/{userId}")
    public ResponseEntity<PatientResponse> updatePatient(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int userId,
            @RequestBody PatientInfoRequest patientInfo) {
        try {
            String token = extractToken(authHeader);

            if (!jwtUtil.validateToken(token)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String privilege = jwtUtil.extractPrivilege(token);
            if (!privilege.equals("Patient") || jwtUtil.extractId(token) != userId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Update the patient
            Patient updatedPatient = patientService.updatePatientByUserId(userId, patientInfo);

            return ResponseEntity.ok(patientMapper.toResponse(updatedPatient));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // -------------------------
    // GET /patients/{patientId}/appointments
    // -------------------------
    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentDto>> getPatientAppointments(@PathVariable Integer patientId) {
        List<Appointment> appointments = appointmentRepository
                .findByPatient_PatientIdAndStatus(patientId, AppointmentStatus.CONFIRMED);

        List<AppointmentDto> response = appointments.stream().map(appt -> new AppointmentDto(
                appt.getAppointmentId(),
                appt.getDoctor().getUser().getFirstName() + " " + appt.getDoctor().getUser().getLastName(),
                appt.getAppointmentType().getName(),
                appt.getDateTimeScheduled(),
                appt.getDateTimeScheduled().plusMinutes(30),
                appt.getStatus()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // -------------------------
    // Helper method to extract token
    // -------------------------
    private String extractToken(String authHeader) {
        if (authHeader.startsWith("Bearer ")) return authHeader.substring(7);
        return authHeader;
    }
}
