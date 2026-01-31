package com.revature.smartAppointment.ControllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.smartAppointment.Controller.AdminController;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Service.TimeSlotService;
import com.revature.smartAppointment.Service.UserService;
import com.revature.smartAppointment.Service.admin.AdminAppointmentService;
import com.revature.smartAppointment.Service.admin.AdminScheduleService;
import com.revature.smartAppointment.Util.JwtUtil;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AdminAppointmentService adminAppointmentService;

    @MockitoBean
    private AdminScheduleService adminScheduleService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private TimeSlotService timeSlotService;

    private static final String AUTH_HEADER = "Bearer valid-token";

    private void mockValidAdminJwt() {
        Mockito.when(jwtUtil.validateToken("valid-token")).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege("valid-token")).thenReturn("Admin");
    }

    // =====================
    // Appointments
    // =====================
    @Test
    void getAllAppointments_returnsList() throws Exception {
        mockValidAdminJwt();

        Mockito.when(adminAppointmentService.getAppointments(null))
                .thenReturn(List.of(
                        Map.of("status", AppointmentStatus.REQUESTED)
                ));

        mockMvc.perform(get("/smart-appointment/api/admin/appointments")
                        .header("Authorization", AUTH_HEADER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("REQUESTED"));
    }

    @Test
    void acceptAppointment_returnsUpdatedAppointment() throws Exception {
        mockValidAdminJwt();

        Mockito.when(adminAppointmentService.updateStatus(1, AppointmentStatus.CONFIRMED))
                .thenReturn(Map.of("status", AppointmentStatus.CONFIRMED));

        mockMvc.perform(put("/smart-appointment/api/admin/appointments/1/accept")
                        .header("Authorization", AUTH_HEADER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void cancelAppointment_returnsUpdatedAppointment() throws Exception {
        mockValidAdminJwt();

        Mockito.when(adminAppointmentService.updateStatus(1, AppointmentStatus.CANCELLED))
                .thenReturn(Map.of("status", AppointmentStatus.CANCELLED));

        mockMvc.perform(put("/smart-appointment/api/admin/appointments/1/cancel")
                        .header("Authorization", AUTH_HEADER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    void rescheduleAppointment_returnsUpdatedAppointment() throws Exception {
        mockValidAdminJwt();

        LocalDate date = LocalDate.of(2026, 1, 25);
        LocalTime time = LocalTime.of(14, 0);
        LocalDateTime dateTime = LocalDateTime.of(date, time);

        Mockito.when(adminAppointmentService.reschedule(eq(1), any(LocalDateTime.class)))
                .thenReturn(Map.of("scheduledDateTime", dateTime));

        mockMvc.perform(put("/smart-appointment/api/admin/appointments/1/reschedule")
                        .header("Authorization", AUTH_HEADER)
                        .param("date", date.toString())
                        .param("time", time.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.scheduledDateTime")
                        .value("2026-01-25T14:00:00"));
    }

    // =====================
    // Schedule
    // =====================
    @Test
    void addSchedule_returnsTimeSlot() throws Exception {
        mockValidAdminJwt();

        LocalDate date = LocalDate.of(2026, 1, 26);
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(10, 0);

        TimeSlot slot = new TimeSlot();
        slot.setDateAvailable(date);
        slot.setStartTime(start);
        slot.setEndTime(end);

        Mockito.when(adminScheduleService.addDoctorAvailability(1, date, start, end))
                .thenReturn(slot);

        mockMvc.perform(post("/smart-appointment/api/admin/doctors/1/schedule")
                        .header("Authorization", AUTH_HEADER)
                        .param("date", date.toString())
                        .param("start", start.toString())
                        .param("end", end.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dateAvailable").value(date.toString()))
                .andExpect(jsonPath("$.startTime").value("09:00:00"))
                .andExpect(jsonPath("$.endTime").value("10:00:00"));
    }
}
