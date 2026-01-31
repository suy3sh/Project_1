package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Controller.Response.UserTableResponse;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Repository.UserRepository;
import com.revature.smartAppointment.Service.DoctorService;
import com.revature.smartAppointment.Service.PatientService;
import com.revature.smartAppointment.Service.UserService;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientService patientService;

    @Mock
    private DoctorService doctorService;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("save")
    void save_success() {
        User user = new User();
        user.setEmail("test@email.com");

        when(userRepository.save(user)).thenReturn(user);

        User saved = userService.save(user);

        assertEquals("test@email.com", saved.getEmail());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("findById")
    void findById_found() {
        User user = new User();
        user.setUserId(1);

        when(userRepository.findById(1))
            .thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getUserId());
    }

    @Test
    void findById_notFound() {
        when(userRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<User> result = userService.findById(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("findAll")
    void findAll_success() {
        when(userRepository.findAll())
            .thenReturn(List.of(new User(), new User()));

        List<User> users = userService.findAll();

        assertEquals(2, users.size());
    }

    @Test
    @DisplayName("deleteById")
    void deleteById_userOnly() {
        User user = new User();
        user.setUserId(1);

        when(userRepository.findById(1))
            .thenReturn(Optional.of(user));
        when(doctorService.findByUserId(1))
            .thenReturn(Optional.empty());
        when(patientService.findByUserId(1))
            .thenReturn(Optional.empty());

        Optional<User> result = userService.deleteById(1);

        assertTrue(result.isPresent());
        verify(userRepository).deleteById(1);
        verify(doctorService, never()).deleteById(anyInt());
        verify(patientService, never()).deleteById(anyInt());
    }

    @Test
    void deleteById_withDoctorAndPatient() {
        User user = new User();
        user.setUserId(1);

        Doctor doctor = new Doctor();
        doctor.setDoctorId(10);

        Patient patient = new Patient();
        patient.setPatientId(20);

        when(userRepository.findById(1))
            .thenReturn(Optional.of(user));
        when(doctorService.findByUserId(1))
            .thenReturn(Optional.of(doctor));
        when(patientService.findByUserId(1))
            .thenReturn(Optional.of(patient));

        Optional<User> result = userService.deleteById(1);

        assertTrue(result.isPresent());

        verify(doctorService).deleteById(10);
        verify(patientService).deleteById(20);
        verify(userRepository).deleteById(1);
    }

    @Test
    void deleteById_notFound() {
        when(userRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<User> result = userService.deleteById(1);

        assertTrue(result.isEmpty());
        verify(userRepository, never()).deleteById(anyInt());
    }

    @Test
    @DisplayName("updateById")
    void updateById_success_partialUpdate() {
        User existing = new User();
        existing.setUserId(1);
        existing.setEmail("old@email.com");

        User updates = new User();
        updates.setEmail("new@email.com");

        when(userRepository.findById(1))
            .thenReturn(Optional.of(existing));
        when(userRepository.save(existing))
            .thenReturn(existing);

        User result = userService.updateById(1, updates);

        assertNotNull(result);
        assertEquals("new@email.com", result.getEmail());
        verify(userRepository).save(existing);
    }

    @Test
    void updateById_notFound() {
        when(userRepository.findById(1))
            .thenReturn(Optional.empty());

        User result = userService.updateById(1, new User());

        assertNull(result);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("findUserByEmail")
    void findUserByEmail_found() {
        User user = new User();
        user.setEmail("test@email.com");

        when(userRepository.findUserByEmail("test@email.com"))
            .thenReturn(Optional.of(user));

        Optional<User> result =
            userService.findUserByEmail("test@email.com");

        assertTrue(result.isPresent());
    }

    @Test
    void findUserByEmail_notFound() {
        when(userRepository.findUserByEmail("missing@email.com"))
            .thenReturn(Optional.empty());

        Optional<User> result =
            userService.findUserByEmail("missing@email.com");

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getUsersForTable")
    void getUsersForTable_success() {
        when(userRepository.findUsersForTable())
            .thenReturn(List.of(
                mock(UserTableResponse.class),
                mock(UserTableResponse.class)
            ));

        List<UserTableResponse> result =
            userService.getUsersForTable();

        assertEquals(2, result.size());
        verify(userRepository).findUsersForTable();
    }
}