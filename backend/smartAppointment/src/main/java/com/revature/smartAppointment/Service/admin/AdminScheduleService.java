package com.revature.smartAppointment.Service.admin;

import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Repository.DoctorRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class AdminScheduleService {
    private final DoctorRepository doctorRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Autowired
    public AdminScheduleService(DoctorRepository doctorRepository, TimeSlotRepository timeSlotRepository) {
        this.doctorRepository = doctorRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public TimeSlot addDoctorAvailability(Integer doctorId, LocalDate date, LocalTime start, LocalTime end) {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LocalTime correctedEnd = start.plusMinutes(30);
        TimeSlot slot = new TimeSlot(start, correctedEnd, date, doctor);
        return timeSlotRepository.save(slot);
    }
}
