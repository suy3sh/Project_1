package com.revature.smartAppointment.Service;

import com.revature.smartAppointment.Controller.Response.UserTableResponse;
import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements ServiceInterface<User> {
    private UserRepository userRepository;
    private PatientService patientService;
    private DoctorService doctorService;

    @Autowired
    public UserService(UserRepository userRepository, PatientService patientService, DoctorService doctorService) {
        this.userRepository = userRepository;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    @Override
    public User save(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public Optional<User> findById(int id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public Optional<User> deleteById(int id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            doctorService.findByUserId(id).ifPresent(doctor -> {
                doctorService.deleteById(doctor.getDoctorId());
            });
            patientService.findByUserId(id).ifPresent(patient -> {
                patientService.deleteById(patient.getPatientId());
            });
            userRepository.deleteById(id);
        }
        return optionalUser;
    }

    @Override
    public User updateById(int id, User newUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (newUser.getEmail() != null) user.setEmail(newUser.getEmail());
            if (newUser.getPassword() != null) user.setPassword(newUser.getPassword());
            if (newUser.getFirstName() != null) user.setFirstName(newUser.getFirstName());
            if (newUser.getLastName() != null) user.setLastName(newUser.getLastName());
            if (newUser.getPrivilege() != null) user.setPrivilege(newUser.getPrivilege());
            return userRepository.save(user);
        }
        return null;
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    public List<UserTableResponse> getUsersForTable() {
        return userRepository.findUsersForTable();
    }
}
