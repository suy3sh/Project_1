
package com.revature.smartAppointment.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.smartAppointment.Controller.Request.DoctorInfoRequest;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Service.DoctorService;
import com.revature.smartAppointment.Service.DoctorService.DoctorAppointmentView;
import com.revature.smartAppointment.Service.DoctorService.DoctorTimeSlotView;
import com.revature.smartAppointment.Util.JwtUtil;

import lombok.AllArgsConstructor;
import lombok.Data;

@RestController
@RequestMapping("/smart-appointment/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {
    private final DoctorService doctorService;
    private final JwtUtil jwtUtil;

    @Autowired
    public DoctorController(DoctorService doctorService, JwtUtil jwtUtil) {
        this.doctorService = doctorService;
        this.jwtUtil = jwtUtil;
    }

    // Basic CRUD for Doctor

    // POST /doctors
    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.save(doctor));
    }

    // GET /doctors
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.findAll());
    }

    // GET /doctors/{doctorId}
    @GetMapping("/{doctorId}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Integer doctorId) {
        return doctorService.findById(doctorId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET /doctors/me
    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyDoctor(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            String privilege = jwtUtil.extractPrivilege(token);
            if (!privilege .equals("Doctor")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            int userId = jwtUtil.extractId(token);

            return doctorService.findByUserId(userId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // PUT /doctors/{doctorId}
    @PutMapping("/{doctorId}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Integer doctorId, @RequestBody Doctor doctor) {
        Doctor updated = doctorService.updateById(doctorId, doctor);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{user_id}")
    public ResponseEntity<Doctor> updateDoctor(@RequestHeader("Authorization") String authHeader, @PathVariable int user_id, @RequestBody DoctorInfoRequest doctorInfo) {
         try {
            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            String privilege = jwtUtil.extractPrivilege(token);
            if ((privilege.equals("Doctor") && jwtUtil.extractId(token) == user_id) || privilege.equals("Super")) {
                int doctor_id = doctorService.findByUserId(user_id).get().getDoctorId();

                Doctor newDoctor = doctorService.convertRequestToObject(doctorInfo);

                Doctor doctor = doctorService.updateById(doctor_id, newDoctor);

                return ResponseEntity.ok(doctor);

            } else {
                throw new RuntimeException("Unauthorized access");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // DELETE /doctors/{doctorId}
    @DeleteMapping("/{doctorId}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Integer doctorId) {
        return doctorService.deleteById(doctorId)
                .map(d -> ResponseEntity.noContent().build())
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // -----------------------------
    // Dashboard: appointments today/week
    // -----------------------------


// GET /doctors/me/appointments/today
@GetMapping("/me/appointments/today")
public ResponseEntity<List<DoctorAppointmentView>> getMyTodaysAppointments(
        @RequestHeader("Authorization") String authHeader) {

    String token = authHeader.substring(7);

    if (!jwtUtil.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    if (!jwtUtil.extractPrivilege(token).equals("Doctor")) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    int userId = jwtUtil.extractId(token);
    int doctorId = doctorService.findByUserId(userId)
            .orElseThrow()
            .getDoctorId();

    return ResponseEntity.ok(
        doctorService.getTodaysAppointments(doctorId)
    );
}
    
   @GetMapping("/{doctorId}/appointments/upcoming")
    public List<DoctorService.DoctorAppointmentView> getUpcomingAppointments(
            @PathVariable Integer doctorId) {

        return doctorService.getUpcomingAppointments(doctorId);
    }

    @GetMapping("/{doctorId}/appointments/all")
    public ResponseEntity<List<DoctorService.DoctorAppointmentView>> getAllAppointments(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(doctorService.getAllAppointmentsForDoctor(doctorId));
    }

    // GET /doctors/{doctorId}/appointments/today
    @GetMapping("/{doctorId}/appointments/today")
    public ResponseEntity<List<DoctorAppointmentView>> getTodaysAppointments(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(doctorService.getTodaysAppointments(doctorId));
    }

    // GET /doctors/{doctorId}/appointments/week
    @GetMapping("/{doctorId}/appointments/week")
    public ResponseEntity<List<DoctorAppointmentView>> getWeeksAppointments(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(doctorService.getCurrentWeeksAppointments(doctorId));
    }

    // GET /doctors/{doctorId}/appointments/{appointmentId}
    @GetMapping("/{doctorId}/appointments/{appointmentId}")
    public ResponseEntity<DoctorAppointmentView> getAppointmentDetails(@PathVariable Integer doctorId,
                                                                       @PathVariable Integer appointmentId) {
        return ResponseEntity.ok(doctorService.getAppointmentDetailsForDoctor(doctorId, appointmentId));
    }

    // -----------------------------
    // Actions: update status / cancel
    // -----------------------------

    // PATCH /doctors/{doctorId}/appointments/{appointmentId}/status
    @PatchMapping("/{doctorId}/appointments/{appointmentId}/status")
    public ResponseEntity<DoctorAppointmentView> updateStatus(@PathVariable Integer doctorId,
                                                              @PathVariable Integer appointmentId,
                                                              @RequestBody UpdateStatusRequest req) {

                       System.out.println("Received status: " + req.getStatus());                                         
        return ResponseEntity.ok(doctorService.updateAppointmentStatus(doctorId, appointmentId, req.getStatus()));
    }

    // POST /doctors/{doctorId}/appointments/{appointmentId}/cancel
    @PostMapping("/{doctorId}/appointments/{appointmentId}/cancel")
    public ResponseEntity<DoctorAppointmentView> cancelAppointment(@PathVariable Integer doctorId,
                                                                   @PathVariable Integer appointmentId) {
        return ResponseEntity.ok(doctorService.cancelAppointment(doctorId, appointmentId));
    }

    // -----------------------------
    // Read-only: slots
    // -----------------------------

    // GET /doctors/{doctorId}/slots
    @GetMapping("/{doctorId}/slots")
    public ResponseEntity<List<DoctorTimeSlotView>> getSlots(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(doctorService.getDoctorTimeSlots(doctorId));
    }

    // -----------------------------
    // Request DTO
    // -----------------------------
    @Data
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        private AppointmentStatus status;
        public UpdateStatusRequest() {}
    }
}