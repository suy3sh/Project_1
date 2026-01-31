package com.revature.smartAppointment.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.revature.smartAppointment.Model.AvailabilityWindow;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.AvailabilityWindowRepository;
import com.revature.smartAppointment.Repository.DoctorRepository;
import com.revature.smartAppointment.dto.AvailabilityWindowDTO;
import com.revature.smartAppointment.dto.DoctorAvailabilityDto;
import com.revature.smartAppointment.dto.SlotDto;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AvailabilityWindowService {

    private final AvailabilityWindowRepository windowRepository;
    private final DoctorRepository doctorRepository;
    private final TimeSlotService timeSlotService;

    @Transactional
    public AvailabilityWindow createWindow(
            Integer doctorId,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    ) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        AvailabilityWindow window = AvailabilityWindow.builder()
                .doctor(doctor)
                .date(date)
                .startTime(startTime)
                .endTime(endTime)
                .active(true)
                .build();

        windowRepository.save(window);
        timeSlotService.generateSlotsForWindow(window);

        return window;
    }

    @Transactional
    public Map<String, Object> deactivateWindow(Integer windowId) {
        AvailabilityWindow window = windowRepository.findById(windowId)
                .orElseThrow(() -> new RuntimeException("Availability window not found"));
        if (window.isActive()) {
            window.setActive(false);
            windowRepository.save(window);
        }

        return timeSlotService.blockBreakPeriod(
                window.getDoctor().getDoctorId(),
                window.getDate(),
                window.getStartTime(),
                window.getEndTime()
        );
    }

    @Transactional
    public List<AvailabilityWindowDTO> getWindowsForDoctor(Integer doctorId) {
        List<AvailabilityWindow> windows = windowRepository.findActiveWindowsByDoctorIdWithDoctor(doctorId);

        return windows.stream().map(w -> new AvailabilityWindowDTO(
                w.getWindowId(),
                w.getDate(),
                w.getStartTime(),
                w.getEndTime(),
                w.isActive(),
                w.getDoctor().getDoctorId(),
                w.getDoctor().getUser().getFirstName() + " " + w.getDoctor().getUser().getLastName()
        )).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, List<DoctorAvailabilityDto>> getAvailabilityByDate() {
        List<TimeSlot> slots = timeSlotService.getAvailableSlots();

        Map<String, List<DoctorAvailabilityDto>> result = new HashMap<>();

        for (TimeSlot slot : slots) {
            String dateKey = slot.getDateAvailable().toString();
            Doctor doctor = slot.getDoctor();

            DoctorAvailabilityDto doctorDTO = new DoctorAvailabilityDto();
            doctorDTO.setDoctorId(doctor.getDoctorId());
            doctorDTO.setDoctorName(doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName());

            SlotDto slotDTO = new SlotDto();
            slotDTO.setSlotId(slot.getSlotId());
            slotDTO.setStartTime(slot.getStartTime().toString());
            slotDTO.setEndTime(slot.getEndTime().toString());
            slotDTO.setAvailable(slot.getStatus() == TimeSlotStatus.AVAILABLE);

            result.computeIfAbsent(dateKey, k -> new ArrayList<>());
            List<DoctorAvailabilityDto> doctorsForDate = result.get(dateKey);

            Optional<DoctorAvailabilityDto> existingDoctor = doctorsForDate.stream()
                    .filter(d -> d.getDoctorId().equals(doctor.getDoctorId()))
                    .findFirst();

            if (existingDoctor.isPresent()) {
                existingDoctor.get().getSlots().add(slotDTO);
            } else {
                doctorDTO.getSlots().add(slotDTO);
                doctorsForDate.add(doctorDTO);
            }
        }

        return result;
    }
}
