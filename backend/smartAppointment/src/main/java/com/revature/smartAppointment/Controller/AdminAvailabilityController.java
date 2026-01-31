package com.revature.smartAppointment.Controller;
import java.util.List;
import java.util.Map;
import com.revature.smartAppointment.dto.AvailabilityWindowDTO;
import com.revature.smartAppointment.Model.AvailabilityWindow;
import com.revature.smartAppointment.Service.AvailabilityWindowService;
import com.revature.smartAppointment.Util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/smart-appointment/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminAvailabilityController {

    private final AvailabilityWindowService availabilityWindowService;
    private final JwtUtil jwtUtil;

    public AdminAvailabilityController(AvailabilityWindowService availabilityWindowService, JwtUtil jwtUtil) {
        this.availabilityWindowService = availabilityWindowService;
        this.jwtUtil = jwtUtil;
    }
    
   /*  @GetMapping("/{doctorId}/availability-windows")
public List<AvailabilityWindow> getAvailabilityWindows(
        @PathVariable Integer doctorId
) {
    return availabilityWindowService.getWindowsForDoctor(doctorId);
}*/
    
    @GetMapping("/doctors/{doctorId}/availability-windows")
    public ResponseEntity<List<AvailabilityWindowDTO>> getAvailabilityWindows(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer doctorId
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(availabilityWindowService.getWindowsForDoctor(doctorId));
    }

    @PostMapping("/doctors/{doctorId}/availability-windows")
    public ResponseEntity<AvailabilityWindowDTO> createAvailabilityWindow(
            @PathVariable Integer doctorId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AvailabilityWindowRequest request
    ) {
        validateAdmin(authHeader);
        AvailabilityWindow window = availabilityWindowService.createWindow(
                doctorId,
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );
        AvailabilityWindowDTO dto = new AvailabilityWindowDTO(
                window.getWindowId(),
                window.getDate(),
                window.getStartTime(),
                window.getEndTime(),
                window.isActive(),
                window.getDoctor().getDoctorId(),
                window.getDoctor().getUser().getFirstName() + " " + window.getDoctor().getUser().getLastName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/availability-windows/{windowId}")
    public ResponseEntity<Map<String, Object>> deleteAvailabilityWindow(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer windowId
    ) {
        validateAdmin(authHeader);
        return ResponseEntity.ok(availabilityWindowService.deactivateWindow(windowId));
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

    public static class AvailabilityWindowRequest {

        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public LocalTime getStartTime() {
            return startTime;
        }

        public void setStartTime(LocalTime startTime) {
            this.startTime = startTime;
        }

        public LocalTime getEndTime() {
            return endTime;
        }

        public void setEndTime(LocalTime endTime) {
            this.endTime = endTime;
        }
    }
}
