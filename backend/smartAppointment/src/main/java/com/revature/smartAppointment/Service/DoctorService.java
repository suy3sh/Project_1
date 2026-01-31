package com.revature.smartAppointment.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.revature.smartAppointment.Controller.Request.DoctorInfoRequest;
import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Repository.DoctorRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Service
public class DoctorService implements ServiceInterface<Doctor> {
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final SpecialityService specialityService;

    @Autowired
    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, TimeSlotRepository timeSlotRepository, SpecialityService specialityService) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.specialityService = specialityService;
    }
     
    @Override
    @Transactional
    public Doctor save(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> findById(int id) {
        return doctorRepository.findById(id);
    }

    @Override
    public List<Doctor> findAll() {
        return doctorRepository.findAll();
    }

    @Override
    public Optional<Doctor> deleteById(int id) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            doctorRepository.deleteById(id);
        }
        return optionalDoctor;
    }

    @Override
    public Doctor updateById(int id, Doctor newDoctor) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            if (newDoctor.getExperienceYears() != null) doctor.setExperienceYears(newDoctor.getExperienceYears());
            if (newDoctor.getGender() != null) doctor.setGender(newDoctor.getGender());
            if (newDoctor.getSpeciality() != null) doctor.setSpeciality(newDoctor.getSpeciality());
            if (newDoctor.getBio() != null) doctor.setBio(newDoctor.getBio());

            return doctorRepository.save(doctor);
        }
        return null;
    }

    public Optional<Doctor> findByUserId(int user_id) {
        return doctorRepository.findDoctorByUser_UserId(user_id);
    }
       
    public List<DoctorAppointmentView> getUpcomingAppointments(Integer doctorId) {
    ensureDoctorExists(doctorId);

    LocalDateTime now = LocalDateTime.now();

    List<Appointment> appts =
            appointmentRepository.findBySlotDoctorDoctorIdAndDateTimeScheduledAfter(doctorId, now);

    return appts.stream()
            .map(DoctorService::toDoctorAppointmentView)
            .toList();
}

    public List<DoctorAppointmentView> getAllAppointmentsForDoctor(Integer doctorId) {
        ensureDoctorExists(doctorId);
        List<Appointment> appointments =
                appointmentRepository.findBySlotDoctorDoctorIdOrderByDateTimeScheduledAsc(doctorId);
        return appointments.stream()
                .map(DoctorService::toDoctorAppointmentViewWithPatient)
                .toList();
    }

    private static DoctorAppointmentView toDoctorAppointmentViewWithPatient(Appointment a) {
        String firstName = null;
        String lastName = null;
        String appointmentType = null;
        Integer estimatedTime = 0;

        if (a.getPatient() != null && a.getPatient().getUser() != null) {
            firstName = a.getPatient().getUser().getFirstName();
            lastName = a.getPatient().getUser().getLastName();
        }

        if (a.getAppointmentType() != null) {
            appointmentType = a.getAppointmentType().getName(); // if enum
            estimatedTime = a.getAppointmentType().getEstimatedTime();
        }

        return new DoctorAppointmentView(
                a.getAppointmentId(),
                firstName,
                lastName,
                appointmentType,
                a.getDateTimeScheduled(),
                estimatedTime,
                a.getStatus()
        );

    }



    public List<DoctorAppointmentView> getTodaysAppointments(Integer doctorId) {
        ensureDoctorExists(doctorId);
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        // Requires repo method:
        // List<Appointment> findBySlotDoctorDoctorIdAndDateTimeScheduledBetween(Integer doctorId, LocalDateTime start, LocalDateTime end);
        List<Appointment> appts =
                appointmentRepository.findBySlotDoctorDoctorIdAndDateTimeScheduledBetween(doctorId, start, end);

        return appts.stream().map(DoctorService::toDoctorAppointmentView).toList();
    }

    public List<DoctorAppointmentView> getCurrentWeeksAppointments(Integer doctorId) {
        ensureDoctorExists(doctorId);

        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        LocalDateTime start = weekStart.atStartOfDay();
        LocalDateTime end = weekEnd.atTime(LocalTime.MAX);

        List<Appointment> appts =
                appointmentRepository.findBySlotDoctorDoctorIdAndDateTimeScheduledBetween(doctorId, start, end);

        return appts.stream().map(DoctorService::toDoctorAppointmentView).toList();
    }

    public DoctorAppointmentView getAppointmentDetailsForDoctor(Integer doctorId, Integer appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        enforceOwnership(doctorId, appt);
        return toDoctorAppointmentView(appt);
    }

    // Doctor Actions: Status Management

    @Transactional
    public DoctorAppointmentView updateAppointmentStatus(Integer doctorId, Integer appointmentId,
                                                         AppointmentStatus newStatus) {
        // Proposal: doctor can update status completed/cancelled/no-show
        // :contentReference[oaicite:7]{index=7}

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        enforceOwnership(doctorId, appt);

        appt.setStatus(newStatus);

        Appointment saved = appointmentRepository.save(appt);
       TimeSlot slot = appt.getSlot();
    if (slot != null) {
        if (newStatus == AppointmentStatus.CANCELLED || newStatus == AppointmentStatus.DENIED) {
            slot.setStatus(TimeSlotStatus.AVAILABLE);   // free the slot
        } else {
            slot.setStatus(TimeSlotStatus.BOOKED);  // keep slot booked (COMPLETED, NO_SHOW, etc.)
        }
        timeSlotRepository.save(slot);
    }
        return toDoctorAppointmentView(saved);
    }

    @Transactional
    public DoctorAppointmentView cancelAppointment(Integer doctorId, Integer appointmentId) {
        // Proposal: doctor can cancel patient appointment
        // :contentReference[oaicite:8]{index=8}

        return updateAppointmentStatus(doctorId, appointmentId, AppointmentStatus.CANCELLED);
    }

    // Read-only: Doctor time slots

    public List<DoctorTimeSlotView> getDoctorTimeSlots(Integer doctorId) {
        ensureDoctorExists(doctorId);

        // Proposal: doctor can view time slot details, but cannot create/delete/modify
        // :contentReference[oaicite:9]{index=9}

        List<TimeSlot> slots = timeSlotRepository.findByDoctor_DoctorIdOrderByDateAvailableAscStartTimeAsc(doctorId);

        return slots.stream()
                .map(s -> new DoctorTimeSlotView(
                        s.getSlotId(),
                        s.getStartTime(),
                        s.getEndTime()))
                .toList();
    }

    // Helpers / DTO mapping

    private void ensureDoctorExists(Integer doctorId) {
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));
    }

   private void enforceOwnership(Integer doctorId, Appointment appt) {

    if (appt.getSlot() == null || appt.getSlot().getDoctor() == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Appointment has no assigned doctor"
        );
    }

    Integer apptDoctorId = appt.getSlot().getDoctor().getDoctorId();

    if (!apptDoctorId.equals(doctorId)) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "This appointment does not belong to the doctor"
        );
    }
}

    private static DoctorAppointmentView toDoctorAppointmentView(Appointment a) {
        String patientFirstName = null;
        String patientLastName = null;
        if (a.getPatient() != null && a.getPatient().getUser() != null) {
            patientFirstName = a.getPatient().getUser().getFirstName();
            patientLastName = a.getPatient().getUser().getLastName();
        }
        // Calculate duration from slot start/end time if slot exists
        Integer estimatedDurationMinutes = null;
        if (a.getSlot() != null && a.getSlot().getStartTime() != null && a.getSlot().getEndTime() != null) {
            estimatedDurationMinutes = (int) java.time.Duration
                .between(a.getSlot().getStartTime(), a.getSlot().getEndTime())
                .toMinutes();
        }

        return new DoctorAppointmentView(
            a.getAppointmentId(),
            patientFirstName,
            patientLastName,
            a.getAppointmentType().getName(), // placeholder for appointment type
            a.getDateTimeScheduled(),
            estimatedDurationMinutes,
            a.getStatus()
        );
    }

    // Lightweight response DTOs

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DoctorAppointmentView {
        private Integer appointmentId;

        private String patientFirstName;
        private String patientLastName;

        private String appointmentType;
        private LocalDateTime scheduledDateTime;
        private Integer estimatedDurationMinutes;

        private AppointmentStatus status;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DoctorTimeSlotView {
        private Integer slotId;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    public Doctor convertRequestToObject(DoctorInfoRequest info) {
        Doctor doctor = new Doctor();

        doctor.setExperienceYears(info.getExperience());
        doctor.setBio(info.getBio());
        doctor.setGender(info.getGender());
        doctor.setSpeciality(specialityService.findSpecialityBySpecialityName(info.getSpeciality()).get());
        System.out.println(doctor);
        
        return doctor;
    }

    
}