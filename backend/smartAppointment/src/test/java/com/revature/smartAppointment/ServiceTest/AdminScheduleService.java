package com.revature.smartAppointment.ServiceTest;

import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Repository.DoctorRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;
import com.revature.smartAppointment.Service.admin.AdminScheduleService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminScheduleServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @InjectMocks
    private AdminScheduleService adminScheduleService;

    private Doctor doctor;

    @BeforeEach
    void setup() {
        doctor = new Doctor();
        doctor.setDoctorId(1);
    }

    @Test
    @DisplayName("addDoctorAvailability")
    void addDoctorAvailability_success_returnsTimeSlot() {
        LocalDate date = LocalDate.of(2026, 1, 25);
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(9, 30);

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(timeSlotRepository.save(any(TimeSlot.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TimeSlot slot = adminScheduleService.addDoctorAvailability(1, date, start, end);

        assertNotNull(slot);
        assertEquals(date, slot.getDateAvailable());
        assertEquals(start, slot.getStartTime());
        assertEquals(end, slot.getEndTime());
        assertEquals(doctor, slot.getDoctor());

        verify(doctorRepository).findById(1);
        verify(timeSlotRepository).save(slot);
    }

    @Test
    void addDoctorAvailability_startAfterEnd_throwsIllegalArgumentException() {
        LocalDate date = LocalDate.of(2026, 1, 25);
        LocalTime start = LocalTime.of(11, 0);
        LocalTime end = LocalTime.of(10, 0);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> adminScheduleService.addDoctorAvailability(1, date, start, end)
        );

        assertEquals("Start time must be before end time", ex.getMessage());
        verifyNoInteractions(doctorRepository, timeSlotRepository);
    }

    @Test
    void addDoctorAvailability_doctorNotFound_throwsRuntimeException() {
        LocalDate date = LocalDate.of(2026, 1, 25);
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(10, 0);

        when(doctorRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> adminScheduleService.addDoctorAvailability(1, date, start, end)
        );

        assertEquals("Doctor not found", ex.getMessage());
        verify(doctorRepository).findById(1);
        verifyNoInteractions(timeSlotRepository);
    }
}
