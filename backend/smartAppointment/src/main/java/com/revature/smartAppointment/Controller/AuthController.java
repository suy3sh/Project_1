package com.revature.smartAppointment.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.smartAppointment.Controller.Request.LoginRequest;
import com.revature.smartAppointment.Controller.Request.RegisterRequest;
import com.revature.smartAppointment.Controller.Response.LoginResponse;
import com.revature.smartAppointment.Controller.Response.RegisterResponse;
import com.revature.smartAppointment.Service.AuthService;

@RestController
@RequestMapping("/smart-appointment/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.validateLogin(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            RegisterResponse registerResponse = authService.validateRegistration(registerRequest);
            return ResponseEntity.ok(registerResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
