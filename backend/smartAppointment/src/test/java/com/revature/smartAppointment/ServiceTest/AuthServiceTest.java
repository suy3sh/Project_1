package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Controller.Request.RegisterRequest;
import com.revature.smartAppointment.Controller.Response.LoginResponse;
import com.revature.smartAppointment.Controller.Response.RegisterResponse;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.Privilege;
import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Service.*;
import com.revature.smartAppointment.Util.JwtUtil;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private PrivilegeService privilegeService;

    @Mock
    private PatientService patientService;

    @Mock
    private DoctorService doctorService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User user;
    private Privilege privilege;

    @BeforeEach
    void setup() {
        privilege = new Privilege();
        privilege.setPrivilegeId(1);
        privilege.setRoleName("PATIENT");

        user = new User("test@email.com", "password", "John", "Doe", privilege);
        user.setUserId(1);
    }

    @Test
    @DisplayName("validateLogin")
    void validateLogin_success() {
        when(userService.findUserByEmail("test@email.com"))
            .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken(anyString(), anyInt(), anyString()))
            .thenReturn("jwt-token");

        LoginResponse response =
            authService.validateLogin("test@email.com", "password");

        assertNotNull(response);
        assertEquals("test@email.com", response.getEmail());
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void validateLogin_wrongPassword_throwsException() {
        when(userService.findUserByEmail("test@email.com"))
            .thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.validateLogin("test@email.com", "wrong"));

        assertEquals("Invalid username or password", ex.getMessage());
    }

    @Test
    void validateLogin_userNotFound_throwsException() {
        when(userService.findUserByEmail("missing@email.com"))
            .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.validateLogin("missing@email.com", "password"));

        assertEquals("Invalid username or password", ex.getMessage());
    }

    @Test
    @DisplayName("validateRegistration")
    void validateRegistration_success_patient() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@email.com");
        request.setPassword("password");
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setPrivilegeId(1);

        when(userService.findUserByEmail("new@email.com"))
            .thenReturn(Optional.empty());

        when(privilegeService.findById(1))
            .thenReturn(Optional.of(privilege));

        when(userService.save(any(User.class)))
            .thenAnswer(invocation -> {
                User saved = invocation.getArgument(0);
                saved.setUserId(2);
                return saved;
            });

        RegisterResponse response =
            authService.validateRegistration(request);

        assertNotNull(response);
        assertEquals("new@email.com", response.getEmail());

        verify(patientService).save(any(Patient.class));
        verify(doctorService, never()).save(any());
    }

    @Test
    void validateRegistration_success_doctor() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("doc@email.com");
        request.setPassword("password");
        request.setFirstName("Doc");
        request.setLastName("Tor");
        request.setPrivilegeId(2);

        privilege.setPrivilegeId(2);
        privilege.setRoleName("DOCTOR");

        when(userService.findUserByEmail("doc@email.com"))
            .thenReturn(Optional.empty());

        when(privilegeService.findById(2))
            .thenReturn(Optional.of(privilege));

        when(userService.save(any(User.class)))
            .thenAnswer(invocation -> {
                User saved = invocation.getArgument(0);
                saved.setUserId(3);
                return saved;
            });

        authService.validateRegistration(request);

        verify(doctorService).save(any(Doctor.class));
        verify(patientService, never()).save(any());
    }

    @Test
    void validateRegistration_emailAlreadyExists_throwsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@email.com");
        request.setPassword("password");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPrivilegeId(1);

        when(userService.findUserByEmail("test@email.com"))
            .thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.validateRegistration(request));

        assertEquals("Invalid email: email already in use", ex.getMessage());
    }

    @Test
    void validateRegistration_invalidPrivilege_throwsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@email.com");
        request.setPassword("password");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPrivilegeId(99);

        when(userService.findUserByEmail("new@email.com"))
            .thenReturn(Optional.empty());

        when(privilegeService.findById(99))
            .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.validateRegistration(request));

        assertEquals("Invalid privilege: privilege does not exist", ex.getMessage());
    }

    @Test
    void validateRegistration_missingRequiredField_throwsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("");  // triggers empty check
        request.setPassword("password");
        request.setFirstName("");  // not null
        request.setLastName("");   // not null
        request.setPrivilegeId(1); // optional if your method checks for null


        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> authService.validateRegistration(request));

        assertEquals("Error: one or more required fields are empty", ex.getMessage());
    }
}