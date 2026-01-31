package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.revature.smartAppointment.Model.*;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Repository.DoctorRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;
import com.revature.smartAppointment.Service.DoctorService;
import com.revature.smartAppointment.Service.DoctorService.DoctorAppointmentView;
import com.revature.smartAppointment.Service.SpecialityService;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @Mock
    private SpecialityService specialityService;

    @InjectMocks
    private DoctorService doctorService;

    private Doctor doctor;
    private Appointment appointment;
    private TimeSlot slot;

    @BeforeEach
    void setup() {
        doctor = new Doctor();
        doctor.setDoctorId(1);

        AppointmentType type = new AppointmentType();
        type.setName("Checkup");

        slot = new TimeSlot();
        slot.setDoctor(doctor);
        slot.setStartTime(LocalTime.of(9, 0));
        slot.setEndTime(LocalTime.of(10, 0));

        appointment = new Appointment();
        appointment.setAppointmentId(100);
        appointment.setSlot(slot);
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setDateTimeScheduled(LocalDateTime.now());
        appointment.setAppointmentType(type);
    }

    @Test
    @DisplayName("Basic CRUD")
    void save_success() {
        when(doctorRepository.save(doctor)).thenReturn(doctor);
        Doctor saved = doctorService.save(doctor);
        assertEquals(doctor, saved);
    }

    @Test
    void updateById_success_updatesFields() {
        Doctor newDoctor = new Doctor();
        newDoctor.setBio("New bio");

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(doctorRepository.save(any())).thenReturn(doctor);

        Doctor updated = doctorService.updateById(1, newDoctor);

        assertEquals("New bio", updated.getBio());
    }

    @Test
    void updateById_notFound_returnsNull() {
        when(doctorRepository.findById(1)).thenReturn(Optional.empty());
        assertNull(doctorService.updateById(1, new Doctor()));
    }

    @Test
    @DisplayName("Appointments")
    void getTodaysAppointments_success() {
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(appointmentRepository
            .findBySlotDoctorDoctorIdAndDateTimeScheduledBetween(anyInt(), any(), any()))
            .thenReturn(List.of(appointment));

        List<DoctorAppointmentView> result =
            doctorService.getTodaysAppointments(1);

        assertEquals(1, result.size());
        assertEquals(AppointmentStatus.CONFIRMED, result.get(0).getStatus());
    }

    @Test
    void getTodaysAppointments_doctorNotFound_throws404() {
        when(doctorRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
            () -> doctorService.getTodaysAppointments(1));
    }

    @Test
    void getAppointmentDetailsForDoctor_success() {
        when(appointmentRepository.findById(100))
            .thenReturn(Optional.of(appointment));

        DoctorAppointmentView view =
            doctorService.getAppointmentDetailsForDoctor(1, 100);

        assertEquals(100, view.getAppointmentId());
    }

    @Test
    void getAppointmentDetailsForDoctor_wrongDoctor_throws403() {
        Doctor otherDoctor = new Doctor();
        otherDoctor.setDoctorId(2);
        slot.setDoctor(otherDoctor);

        when(appointmentRepository.findById(100))
            .thenReturn(Optional.of(appointment));

        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> doctorService.getAppointmentDetailsForDoctor(1, 100)
        );

        assertEquals(403, ex.getStatusCode().value());
    }

    @Test
    void getAppointmentDetailsForDoctor_noDoctorAssigned_throws400() {
        slot.setDoctor(null);

        when(appointmentRepository.findById(100))
            .thenReturn(Optional.of(appointment));

        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> doctorService.getAppointmentDetailsForDoctor(1, 100)
        );

        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    @DisplayName("Appointment Status")
    void updateAppointmentStatus_success() {
        when(appointmentRepository.findById(100))
            .thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any()))
            .thenReturn(appointment);

        DoctorAppointmentView view =
            doctorService.updateAppointmentStatus(
                1, 100, AppointmentStatus.COMPLETED);

        assertEquals(AppointmentStatus.COMPLETED, view.getStatus());
    }

    @Test
    void updateAppointmentStatus_notFound_throws404() {
        when(appointmentRepository.findById(100))
            .thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
            () -> doctorService.updateAppointmentStatus(
                1, 100, AppointmentStatus.CANCELLED));
    }

    @Test
    @DisplayName("Time Slots")
    void getDoctorTimeSlots_success() {
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(timeSlotRepository.findByDoctor_DoctorIdOrderByDateAvailableAscStartTimeAsc(1))
            .thenReturn(List.of(slot));

        var result = doctorService.getDoctorTimeSlots(1);

        assertEquals(1, result.size());
        assertEquals(LocalTime.of(9, 0), result.get(0).getStartTime());
    }
}