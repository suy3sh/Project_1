package com.revature.smartAppointment.Controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;  
import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Service.AppointmentService;
import com.revature.smartAppointment.Service.PatientService;
import com.revature.smartAppointment.Util.JwtUtil;
import com.revature.smartAppointment.dto.AppointmentDto;

@RestController
@RequestMapping("/smart-appointment/api/patient/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientAppointmentController {

    private final AppointmentService appointmentService;
    private final PatientService patientService;
    private final JwtUtil jwtUtil;

    public PatientAppointmentController(AppointmentService appointmentService, PatientService patientService, JwtUtil jwtUtil) {
        this.appointmentService = appointmentService;
        this.patientService = patientService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createAppointment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateAppointmentRequest request
    ) {
        String token;
        try {
            token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (!"Patient".equals(privilege)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        int userId = jwtUtil.extractId(token);
        Patient patient = patientService.findByUserId(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        Map<String, Object> result = appointmentService.createAppointmentFromSlot(
                patient,
                request.getSlotId(),
                request.getAppointmentTypeId()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
     
     @GetMapping("/{patientId}/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments(@PathVariable Integer patientId) {

        List<Appointment> appointments = appointmentService.getConfirmedAppointmentsForPatient(patientId);

        // Convert Appointment entity to DTO for frontend
        List<AppointmentDto> dtos = appointments.stream()
            .map(appointment -> new AppointmentDto(
                    appointment.getAppointmentId(),
                    "Dr. " + appointment.getDoctor().getUser().getFirstName() 
                             + " " + appointment.getDoctor().getUser().getLastName(),
                    appointment.getAppointmentType().getName(),
                    appointment.getDateTimeScheduled(),
                    appointment.getDateTimeScheduled().plusMinutes(30),
                    appointment.getStatus() // AppointmentStatus enum
            ))
            .toList();

    return ResponseEntity.ok(dtos);
}


    @GetMapping("/current")
    public ResponseEntity<List<Map<String, Object>>> getCurrentAppointments(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token;
        try {
            token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (!"Patient".equals(privilege)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        int userId = jwtUtil.extractId(token);
        Patient patient = patientService.findByUserId(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        List<Map<String, Object>> appointments = appointmentService.getCurrentAppointmentsForPatient(patient.getPatientId());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentHistory(
            @RequestHeader("Authorization") String authHeader
    ) {
        String token;
        try {
            token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (!"Patient".equals(privilege)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        int userId = jwtUtil.extractId(token);
        Patient patient = patientService.findByUserId(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        List<Map<String, Object>> appointments = appointmentService.getAppointmentHistoryForPatient(patient.getPatientId());
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> cancelAppointment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer appointmentId
    ) {
        String token;
        try {
            token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (!"Patient".equals(privilege)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        int userId = jwtUtil.extractId(token);
        Patient patient = patientService.findByUserId(userId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        appointmentService.cancelAppointmentForPatient(patient.getPatientId(), appointmentId);
        return ResponseEntity.noContent().build();
    }

    public static class CreateAppointmentRequest {
        private Integer slotId;
        private Integer appointmentTypeId;

        public Integer getSlotId() {
            return slotId;
        }

        public void setSlotId(Integer slotId) {
            this.slotId = slotId;
        }

        public Integer getAppointmentTypeId() {
            return appointmentTypeId;
        }

        public void setAppointmentTypeId(Integer appointmentTypeId) {
            this.appointmentTypeId = appointmentTypeId;
        }
    }
}
