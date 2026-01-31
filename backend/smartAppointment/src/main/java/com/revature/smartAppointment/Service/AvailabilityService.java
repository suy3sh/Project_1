package com.revature.smartAppointment.Service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.TimeSlotRepository;
import com.revature.smartAppointment.dto.DoctorAvailabilityDto;
import com.revature.smartAppointment.dto.SlotDto;

@Service
public class AvailabilityService {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    public Map<String, List<DoctorAvailabilityDto>> getAvailability() {

        List<TimeSlot> availableSlots =
                timeSlotRepository.findByStatus(TimeSlotStatus.AVAILABLE);

        Map<String, List<DoctorAvailabilityDto>> result = new HashMap<>();

        Map<String, Map<Integer, DoctorAvailabilityDto>> temp = new HashMap<>();

        for (TimeSlot slot : availableSlots) {
            String date = slot.getDateAvailable().toString();

            temp.putIfAbsent(date, new HashMap<>());

            var doctorMap = temp.get(date);

            Integer doctorId = slot.getDoctor().getDoctorId();

            doctorMap.putIfAbsent(doctorId, new DoctorAvailabilityDto());

            DoctorAvailabilityDto doctorDto = doctorMap.get(doctorId);
            doctorDto.setDoctorId(doctorId);
            doctorDto.setDoctorName(
                slot.getDoctor().getUser().getFirstName() + " " + slot.getDoctor().getUser().getLastName()
            );
          
            SlotDto slotDto = new SlotDto();
            slotDto.setSlotId(slot.getSlotId());
            slotDto.setStartTime(slot.getStartTime().toString());
            slotDto.setEndTime(slot.getEndTime().toString());
            slotDto.setAvailable(slot.getStatus() == TimeSlotStatus.AVAILABLE);

            doctorDto.getSlots().add(slotDto);
        }

        // convert to final structure
        temp.forEach((date, doctors) ->
            result.put(date, new ArrayList<>(doctors.values()))
        );

        return result;
    }
}
