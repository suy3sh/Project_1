package com.revature.smartAppointment.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.smartAppointment.Controller.Request.RegisterRequest;
import com.revature.smartAppointment.Controller.Response.LoginResponse;
import com.revature.smartAppointment.Controller.Response.RegisterResponse;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.Privilege;
import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Util.JwtUtil;

@Service
public class AuthService {
    private UserService userService;
    private PrivilegeService privilegeService;
    private PatientService patientService;
    public DoctorService doctorService;

    private JwtUtil jwtUtil;

    @Autowired
    public AuthService(UserService userService, PrivilegeService privilegeService, PatientService patientService, DoctorService doctorService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.privilegeService = privilegeService;
        this.patientService = patientService;
        this.doctorService = doctorService;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse validateLogin(String email, String password) {
        Optional<User> optionalUser = userService.findUserByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password)) {
                String token = jwtUtil.generateToken(email, user.getUserId(), user.getPrivilege().getRoleName());
                LoginResponse loginResponse = new LoginResponse(user.getUserId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.getPrivilege(), token);

                return loginResponse;
            }
        }
        throw new RuntimeException("Invalid username or password");
    }

    @Transactional
    public RegisterResponse validateRegistration(RegisterRequest registerRequest) {
        if (registerRequest.getFirstName().isEmpty() || registerRequest.getLastName().isEmpty() || registerRequest.getEmail().isEmpty() || registerRequest.getPassword().isEmpty() || registerRequest.getPrivilegeId() == null) {
            throw new RuntimeException("Error: one or more required fields are empty");
        }
        Optional<User> optionalUser = userService.findUserByEmail(registerRequest.getEmail());
        if (optionalUser.isPresent()) {
            throw new RuntimeException("Invalid email: email already in use");
        }
        Optional<Privilege> optionalPrivilege = privilegeService.findById(registerRequest.getPrivilegeId());
        if (optionalPrivilege.isEmpty()) {
            throw new RuntimeException("Invalid privilege: privilege does not exist");
        }

        User user = new User(registerRequest.getEmail(), registerRequest.getPassword(), registerRequest.getFirstName(), registerRequest.getLastName(), optionalPrivilege.get());

        User newUser = userService.save(user);
        if (registerRequest.getPrivilegeId() == 1) {
            Patient patient = new Patient();
            patient.setUser(newUser);
            patientService.save(patient);
        }
        else if (registerRequest.getPrivilegeId() == 2) {
            Doctor doctor = new Doctor();
            doctor.setUser(newUser);
            doctorService.save(doctor);
        }

        return new RegisterResponse(newUser.getUserId(), newUser.getEmail(), newUser.getPrivilege());
    }
}
