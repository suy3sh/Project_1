package com.revature.smartAppointment.ControllerTest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.smartAppointment.Controller.AuthController;
import com.revature.smartAppointment.Controller.Request.LoginRequest;
import com.revature.smartAppointment.Controller.Request.RegisterRequest;
import com.revature.smartAppointment.Controller.Response.LoginResponse;
import com.revature.smartAppointment.Controller.Response.RegisterResponse;
import com.revature.smartAppointment.Service.AuthService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // create manually to avoid missing bean issue in Spring Boot 4
    private ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthService authService;

    // =========================
    // LOGIN TESTS
    // =========================

    @Test
    void login_success_returns200() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@email.com");
        request.setPassword("password");

        LoginResponse response = new LoginResponse();
        response.setEmail("test@email.com");
        response.setToken("jwt-token");

        when(authService.validateLogin(request.getEmail(), request.getPassword()))
            .thenReturn(response);

        mockMvc.perform(post("/smart-appointment/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@email.com"))
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void login_invalidCredentials_returns400() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@email.com");
        request.setPassword("wrong");

        when(authService.validateLogin(request.getEmail(), request.getPassword()))
            .thenThrow(new RuntimeException("Invalid username or password"));

        mockMvc.perform(post("/smart-appointment/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid username or password"));
    }

    // =========================
    // REGISTER TESTS
    // =========================

    @Test
    void register_success_returns200() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@email.com");
        request.setPassword("password");
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setPrivilegeId(1);

        RegisterResponse response = new RegisterResponse();
        response.setEmail("new@email.com");

        when(authService.validateRegistration(any(RegisterRequest.class)))
            .thenReturn(response);

        mockMvc.perform(post("/smart-appointment/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("new@email.com"));
    }

    @Test
    void register_existingEmail_returns400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@email.com");
        request.setPassword("password");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPrivilegeId(1);

        when(authService.validateRegistration(any(RegisterRequest.class)))
            .thenThrow(new RuntimeException("Invalid email: email already in use"));

        mockMvc.perform(post("/smart-appointment/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid email: email already in use"));
    }
}
