package com.revature.smartAppointment.ControllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.smartAppointment.Controller.DoctorController;
import com.revature.smartAppointment.Controller.DoctorController.UpdateStatusRequest;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Service.DoctorService;
import com.revature.smartAppointment.Service.DoctorService.DoctorAppointmentView;
import com.revature.smartAppointment.Service.DoctorService.DoctorTimeSlotView;
import com.revature.smartAppointment.Util.JwtUtil;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DoctorController.class)
@AutoConfigureMockMvc(addFilters = false)
class DoctorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private DoctorService doctorService;

    @MockitoBean
    private JwtUtil jwtUtil;

    // -------------------------
    // Basic CRUD
    // -------------------------
    @Test
    void getDoctorById_found_returns200() throws Exception {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);
        doctor.setBio("This is a test bio");

        Mockito.when(doctorService.findById(1)).thenReturn(Optional.of(doctor));

        mockMvc.perform(get("/smart-appointment/api/doctors/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bio").value("This is a test bio"));
    }

    @Test
    void getDoctorById_notFound_returns404() throws Exception {
        Mockito.when(doctorService.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(get("/smart-appointment/api/doctors/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createDoctor_returnsSavedDoctor() throws Exception {
        Doctor doctor = new Doctor();
        doctor.setGender("female");

        Mockito.when(doctorService.save(any(Doctor.class))).thenReturn(doctor);

        mockMvc.perform(post("/smart-appointment/api/doctors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(doctor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gender").value("female"));
    }

    @Test
    void deleteDoctor_found_returns204() throws Exception {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        Mockito.when(doctorService.deleteById(1)).thenReturn(Optional.of(doctor));

        mockMvc.perform(delete("/smart-appointment/api/doctors/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteDoctor_notFound_returns404() throws Exception {
        Mockito.when(doctorService.deleteById(1)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/smart-appointment/api/doctors/1"))
                .andExpect(status().isNotFound());
    }

    // -------------------------
    // JWT-protected endpoint
    // -------------------------
    @Test
    void getMyDoctor_validToken_returnsDoctor() throws Exception {
        String token = "valid.jwt.token";

        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);
        doctor.setBio("I am Dr. Strange");

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Doctor");
        Mockito.when(jwtUtil.extractId(token)).thenReturn(42);
        Mockito.when(doctorService.findByUserId(42)).thenReturn(Optional.of(doctor));

        mockMvc.perform(get("/smart-appointment/api/doctors/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bio").value("I am Dr. Strange"));
    }

    @Test
    void getMyDoctor_invalidToken_returns401() throws Exception {
        String token = "invalid.jwt";

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(false);

        mockMvc.perform(get("/smart-appointment/api/doctors/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    // -------------------------
    // Update appointment status
    // -------------------------
    @Test
    void updateStatus_returnsUpdatedAppointmentView() throws Exception {
        DoctorAppointmentView view = new DoctorAppointmentView();
        view.setStatus(AppointmentStatus.CONFIRMED);

        UpdateStatusRequest req = new UpdateStatusRequest();
        req.setStatus(AppointmentStatus.CONFIRMED);

        Mockito.when(doctorService.updateAppointmentStatus(eq(1), eq(100), eq(AppointmentStatus.CONFIRMED)))
                .thenReturn(view);

        mockMvc.perform(patch("/smart-appointment/api/doctors/1/appointments/100/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    // -------------------------
    // Slots
    // -------------------------
    @Test
    void getSlots_returnsSlotList() throws Exception {
        DoctorTimeSlotView slot = new DoctorTimeSlotView();
        slot.setSlotId(1);

        Mockito.when(doctorService.getDoctorTimeSlots(1)).thenReturn(List.of(slot));

        mockMvc.perform(get("/smart-appointment/api/doctors/1/slots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slotId").value(1));
    }
}
