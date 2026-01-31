package com.revature.smartAppointment.ControllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.smartAppointment.Controller.PatientController;
import com.revature.smartAppointment.Controller.Request.PatientInfoRequest;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Service.PatientService;
import com.revature.smartAppointment.Service.UserService;
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

@WebMvcTest(PatientController.class)
@AutoConfigureMockMvc(addFilters = false)
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private PatientService patientService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AppointmentRepository appointmentRepository;

    private static final String BASE = "/smart-appointment/api/patients";

    // -------------------------
    // GET /patients
    // -------------------------
    @Test
    void getPatients_returnsList() throws Exception {
        Mockito.when(patientService.findAll())
                .thenReturn(List.of(new Patient(), new Patient()));

        mockMvc.perform(get(BASE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // -------------------------
    // GET /patients/{user_id}
    // -------------------------
    @Test
    void getPatient_patientOwnRecord_success() throws Exception {
        String token = "valid.token";

        Patient patient = new Patient();
        patient.setPatientId(1);

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Patient");
        Mockito.when(jwtUtil.extractId(token)).thenReturn(10);
        Mockito.when(patientService.findByUserId(10))
                .thenReturn(Optional.of(patient));

        mockMvc.perform(get(BASE + "/10")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void getPatient_doctorAccess_success() throws Exception {
        String token = "doctor.token";

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Doctor");
        Mockito.when(patientService.findByUserId(99))
                .thenReturn(Optional.of(new Patient()));

        mockMvc.perform(get(BASE + "/99")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void getPatient_notFound_returns400() throws Exception {
        String token = "valid.token";

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Doctor");
        Mockito.when(patientService.findByUserId(99))
                .thenReturn(Optional.empty());

        mockMvc.perform(get(BASE + "/99")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getPatient_invalidToken_returns401() throws Exception {
        Mockito.when(jwtUtil.validateToken("bad")).thenReturn(false);

        mockMvc.perform(get(BASE + "/1")
                        .header("Authorization", "Bearer bad"))
                .andExpect(status().isUnauthorized());
    }

    // -------------------------
    // GET /patients/me
    // -------------------------
    @Test
    void getMyPatient_success() throws Exception {
        String token = "patient.token";

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Patient");
        Mockito.when(jwtUtil.extractId(token)).thenReturn(7);
        Mockito.when(patientService.findByUserId(7))
                .thenReturn(Optional.of(new Patient()));

        mockMvc.perform(get(BASE + "/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void getMyPatient_wrongRole_returns403() throws Exception {
        String token = "doctor.token";

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Doctor");

        mockMvc.perform(get(BASE + "/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    // -------------------------
    // PATCH /patients/{user_id}
    // -------------------------
    @Test
    void updatePatient_success() throws Exception {
        String token = "patient.token";

        Patient existing = new Patient();
        existing.setPatientId(3);

        Patient updated = new Patient();

        PatientInfoRequest req = new PatientInfoRequest();
        req.setAddress("123 Main St");

        Mockito.when(jwtUtil.validateToken(token)).thenReturn(true);
        Mockito.when(jwtUtil.extractPrivilege(token)).thenReturn("Patient");
        Mockito.when(jwtUtil.extractId(token)).thenReturn(10);

        Mockito.when(patientService.findByUserId(10))
                .thenReturn(Optional.of(existing));

        Mockito.when(patientService.convertRequestToObject(any()))
                .thenReturn(updated);

        Mockito.when(patientService.updateById(eq(3), any()))
                .thenReturn(updated);

        mockMvc.perform(patch(BASE + "/10")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void updatePatient_unauthorized_returns400() throws Exception {
        Mockito.when(jwtUtil.validateToken("bad")).thenReturn(false);

        mockMvc.perform(patch(BASE + "/1")
                        .header("Authorization", "Bearer bad")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
