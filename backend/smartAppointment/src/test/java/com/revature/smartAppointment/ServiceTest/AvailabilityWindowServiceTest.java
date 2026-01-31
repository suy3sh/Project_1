package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Model.*;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.*;
import com.revature.smartAppointment.Service.AvailabilityWindowService;
import com.revature.smartAppointment.Service.TimeSlotService;
import com.revature.smartAppointment.dto.AvailabilityWindowDTO;
import com.revature.smartAppointment.dto.DoctorAvailabilityDto;

@ExtendWith(MockitoExtension.class)
class AvailabilityWindowServiceTest {

    @Mock
    private AvailabilityWindowRepository windowRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private TimeSlotService timeSlotService;

    @InjectMocks
    private AvailabilityWindowService availabilityWindowService;

    @Test
    @DisplayName("createWindow")
    void createWindow_success_createsWindowAndDelegatesSlotGeneration() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        LocalDate date = LocalDate.now();
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(10, 0);

        when(doctorRepository.findById(1))
                .thenReturn(Optional.of(doctor));

        AvailabilityWindow window =
                availabilityWindowService.createWindow(1, date, start, end);

        assertNotNull(window);
        assertEquals(doctor, window.getDoctor());
        assertEquals(date, window.getDate());
        assertTrue(window.isActive());

        verify(windowRepository).save(any(AvailabilityWindow.class));
        verify(timeSlotService).generateSlotsForWindow(any(AvailabilityWindow.class));
    }

    @Test
    void createWindow_doctorNotFound_throwsException() {
        when(doctorRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> availabilityWindowService.createWindow(
                        1,
                        LocalDate.now(),
                        LocalTime.of(9, 0),
                        LocalTime.of(10, 0))
        );

        assertEquals("Doctor not found", ex.getMessage());

        verifyNoInteractions(windowRepository, timeSlotService);
    }

    @Test
    @DisplayName("deactivateWindow")
    void deactivateWindow_activeWindow_deactivatesAndBlocksSlots() {
        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);

        AvailabilityWindow window = AvailabilityWindow.builder()
                .windowId(10)
                .doctor(doctor)
                .date(LocalDate.now())
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .active(true)
                .build();

        when(windowRepository.findById(10))
                .thenReturn(Optional.of(window));

        when(timeSlotService.blockBreakPeriod(
                eq(1),
                any(),
                any(),
                any()
        )).thenReturn(Map.of("blocked", true));

        Map<String, Object> result =
                availabilityWindowService.deactivateWindow(10);

        assertFalse(window.isActive());
        assertEquals(true, result.get("blocked"));

        verify(windowRepository).save(window);
        verify(timeSlotService).blockBreakPeriod(
                eq(1),
                any(),
                any(),
                any()
        );
    }

    @Test
    void deactivateWindow_notFound_throwsException() {
        when(windowRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> availabilityWindowService.deactivateWindow(1)
        );

        assertEquals("Availability window not found", ex.getMessage());
    }

    @Test
    @DisplayName("getWindowsForDoctor")
    void getWindowsForDoctor_success_mapsToDTOs() {
        User user = new User();
        user.setFirstName("Jane");
        user.setLastName("Doe");

        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);
        doctor.setUser(user);

        AvailabilityWindow window = AvailabilityWindow.builder()
                .windowId(100)
                .doctor(doctor)
                .date(LocalDate.now())
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .active(true)
                .build();

        when(windowRepository.findActiveWindowsByDoctorIdWithDoctor(1))
                .thenReturn(List.of(window));

        List<AvailabilityWindowDTO> result =
                availabilityWindowService.getWindowsForDoctor(1);

        assertEquals(1, result.size());

        AvailabilityWindowDTO dto = result.get(0);
        assertEquals(100, dto.getWindowId());
        assertEquals(1, dto.getDoctorId());
        assertEquals("Jane Doe", dto.getDoctorName());
        assertTrue(dto.isActive());
    }

    @Test
    void getWindowsForDoctor_noWindows_returnsEmptyList() {
        when(windowRepository.findActiveWindowsByDoctorIdWithDoctor(1))
                .thenReturn(List.of());

        List<AvailabilityWindowDTO> result =
                availabilityWindowService.getWindowsForDoctor(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getAvailabilityByDate")
    void getAvailabilityByDate_groupsSlotsByDateAndDoctor() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Smith");

        Doctor doctor = new Doctor();
        doctor.setDoctorId(1);
        doctor.setUser(user);

        TimeSlot slot = new TimeSlot();
        slot.setSlotId(5);
        slot.setDoctor(doctor);
        slot.setDateAvailable(LocalDate.of(2026, 1, 25));
        slot.setStartTime(LocalTime.of(9, 0));
        slot.setEndTime(LocalTime.of(9, 30));
        slot.setStatus(TimeSlotStatus.AVAILABLE);

        when(timeSlotService.getAvailableSlots())
                .thenReturn(List.of(slot));

        Map<String, List<DoctorAvailabilityDto>> result =
                availabilityWindowService.getAvailabilityByDate();

        assertEquals(1, result.size());
        assertTrue(result.containsKey("2026-01-25"));

        DoctorAvailabilityDto dto = result.get("2026-01-25").get(0);
        assertEquals(1, dto.getDoctorId());
        assertEquals("John Smith", dto.getDoctorName());
        assertEquals(1, dto.getSlots().size());
        assertTrue(dto.getSlots().get(0).isAvailable());
    }
}
