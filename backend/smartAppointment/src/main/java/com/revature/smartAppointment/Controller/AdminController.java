package com.revature.smartAppointment.Controller;

import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Service.TimeSlotService;
import com.revature.smartAppointment.Service.admin.AdminAppointmentService;
import com.revature.smartAppointment.Service.admin.AdminScheduleService;
import com.revature.smartAppointment.Service.UserService;
import com.revature.smartAppointment.Util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("smart-appointment/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    private final AdminAppointmentService adminAppointmentService;
    private final AdminScheduleService adminScheduleService;
    private final TimeSlotService timeSlotService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Autowired
    public AdminController(
            AdminAppointmentService adminAppointmentService,
            AdminScheduleService adminScheduleService,
            TimeSlotService timeSlotService,
            JwtUtil jwtUtil,
            UserService userService
    ) {
        this.adminAppointmentService = adminAppointmentService;
        this.adminScheduleService = adminScheduleService;
        this.timeSlotService = timeSlotService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    //  View ALL appointments (system-wide)
    @GetMapping("/appointments")
    public ResponseEntity<List<Map<String, Object>>> getAllAppointments(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String status
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(adminAppointmentService.getAppointments(status));
    }

    //  Accept appointment
    @PutMapping("/appointments/{id}/accept")
    public ResponseEntity<Map<String, Object>> accept(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(
                adminAppointmentService.updateStatus(id, AppointmentStatus.CONFIRMED)
        );
    }

    //  Cancel appointment
    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancel(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(
                adminAppointmentService.updateStatus(id, AppointmentStatus.CANCELLED)
        );
    }

    //  Deny appointment
    @PatchMapping("/appointments/{id}/deny")
    public ResponseEntity<Map<String, Object>> deny(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(
                adminAppointmentService.updateStatus(id, AppointmentStatus.DENIED)
        );
    }

    //  Reschedule appointment
    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<Map<String, Object>> reschedule(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer id,
            @RequestParam LocalDate date,
            @RequestParam LocalTime time
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(
            adminAppointmentService.reschedule(
                    id,
                    java.time.LocalDateTime.of(date, time)
            )
        );
    }

    @PostMapping("/doctors/{doctorId}/schedule")
    public TimeSlot addSchedule(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer doctorId,
            @RequestParam LocalDate date,
            @RequestParam LocalTime start,
            @RequestParam LocalTime end
    ) {
        validateAdmin(authHeader);
        return adminScheduleService.addDoctorAvailability(doctorId, date, start, end);
    }

    @GetMapping("/doctors/{doctorId}/time-slots")
    public ResponseEntity<List<TimeSlotService.PublicTimeSlotView>> getDoctorSlots(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer doctorId,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(timeSlotService.getSlotsForDoctorRange(doctorId, from, to));
    }

    @GetMapping("/time-slots")
    public ResponseEntity<List<TimeSlotService.PublicTimeSlotView>> getAllTimeSlots(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) TimeSlotStatus status,
            @RequestParam(required = false) Integer doctorId
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(timeSlotService.getAdminTimeSlots(doctorId, from, to, status));
    }

    @GetMapping("/staff")
    public ResponseEntity<List<com.revature.smartAppointment.Controller.Response.UserTableResponse>> getStaff(
            @RequestHeader("Authorization") String authHeader
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(userService.getUsersForTable());
    }

    private void validateAdmin(String authHeader) {
        try {
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
            }
            String privilege = jwtUtil.extractPrivilege(token);
            if (!"Admin".equals(privilege) && !"Super".equals(privilege)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
            }
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}
