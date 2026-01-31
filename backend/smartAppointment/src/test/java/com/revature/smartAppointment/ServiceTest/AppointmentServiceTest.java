package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;
import com.revature.smartAppointment.Service.AppointmentService;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    @DisplayName("save")
    void save_success() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setSlotId(1);
        timeSlot.setDoctor(doctor);
        timeSlot.setDateAvailable(LocalDate.now());
        timeSlot.setStartTime(LocalTime.of(9, 0));

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setSlot(timeSlot);
        

        when(timeSlotRepository.findById(timeSlot.getSlotId())).thenReturn(Optional.of(timeSlot));
        when(timeSlotRepository.bookSlotIfAvailable(timeSlot.getSlotId())).thenReturn(1);
        when(appointmentRepository.save(appointment)).thenReturn(appointment);

        Appointment saved = appointmentService.save(appointment);

        assertNotNull(saved);
        verify(appointmentRepository).save(appointment);
    }

    @Test
    @DisplayName("findById")
    void findById_found() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);

        when(appointmentRepository.findById(1))
            .thenReturn(Optional.of(appointment));

        Optional<Appointment> result = appointmentService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getAppointmentId());
    }

    @Test
    void findById_notFound() {
        when(appointmentRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Appointment> result = appointmentService.findById(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("findAll")
    void findAll_success() {
        when(appointmentRepository.findAll())
            .thenReturn(List.of(new Appointment(), new Appointment()));

        List<Appointment> result = appointmentService.findAll();

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("deleteById")
    void deleteById_found_deletes() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);

        when(appointmentRepository.findById(1))
            .thenReturn(Optional.of(appointment));

        Optional<Appointment> result =
            appointmentService.deleteById(1);

        assertTrue(result.isPresent());
        verify(appointmentRepository).delete(appointment);
    }

    @Test
    void deleteById_notFound() {
        when(appointmentRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Appointment> result =
            appointmentService.deleteById(1);

        assertTrue(result.isEmpty());
        verify(appointmentRepository, never()).delete(any());
    }

    @Test
    @DisplayName("updateById")
    void updateById_success() {
        Appointment existing = new Appointment();
        existing.setAppointmentId(1);

        Appointment updates = new Appointment();
        updates.setStatus(AppointmentStatus.COMPLETED);

        when(appointmentRepository.findById(1))
            .thenReturn(Optional.of(existing));
        when(appointmentRepository.save(existing))
            .thenReturn(existing);

        Appointment result =
            appointmentService.updateById(1, updates);

        assertNotNull(result);
        assertEquals(AppointmentStatus.COMPLETED, result.getStatus());
        verify(appointmentRepository).save(existing);
    }

    @Test
    void updateById_notFound() {
        when(appointmentRepository.findById(1))
            .thenReturn(Optional.empty());

        Appointment result =
            appointmentService.updateById(1, new Appointment());

        assertNull(result);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("cancelAppointment")
    void cancelAppointment_success_freesSlotAndCancels() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        TimeSlot slot = new TimeSlot();
        slot.setSlotId(1);
        slot.setDoctor(doctor);
        slot.setStatus(TimeSlotStatus.BOOKED);

        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);
        appointment.setSlot(slot);
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        when(appointmentRepository.findById(1))
            .thenReturn(Optional.of(appointment));

        doAnswer(invocation -> {
            slot.setStatus(TimeSlotStatus.AVAILABLE);
            return null;
        }).when(timeSlotRepository).freeSlotIfBooked(slot.getSlotId());

        appointmentService.cancelAppointment(1);

        assertEquals(TimeSlotStatus.AVAILABLE, slot.getStatus());
        assertEquals(AppointmentStatus.CANCELLED, appointment.getStatus());

        verify(timeSlotRepository).freeSlotIfBooked(slot.getSlotId());
        verify(appointmentRepository).save(appointment);
    }


    @Test
    void cancelAppointment_noSlot_stillCancelsAppointment() {
        Appointment appointment = new Appointment();
        appointment.setAppointmentId(1);
        appointment.setSlot(null);

        when(appointmentRepository.findById(1))
            .thenReturn(Optional.of(appointment));

        appointmentService.cancelAppointment(1);

        assertEquals(AppointmentStatus.CANCELLED, appointment.getStatus());
        verify(timeSlotRepository, never()).save(any());
        verify(appointmentRepository).save(appointment);
    }

    @Test
    void cancelAppointment_notFound_throwsException() {
        when(appointmentRepository.findById(1))
            .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
            RuntimeException.class,
            () -> appointmentService.cancelAppointment(1)
        );

        assertEquals("Appointment not found", ex.getMessage());
    }
}