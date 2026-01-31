package com.revature.smartAppointment.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.AppointmentType;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Repository.AppointmentTypeRepository;
import com.revature.smartAppointment.Repository.PatientRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;
import com.revature.smartAppointment.dto.AppointmentDto;

@Service
public class AppointmentService implements ServiceInterface<Appointment> {
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentTypeRepository appointmentTypeRepository;
    private final PatientRepository patientRepository;

    @Autowired
    public AppointmentService(
            AppointmentRepository appointmentRepository,
            TimeSlotRepository timeSlotRepository,
            AppointmentTypeRepository appointmentTypeRepository,
            PatientRepository patientRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.appointmentTypeRepository = appointmentTypeRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    @Transactional
    public Appointment save(Appointment entity) {
        return createAppointment(entity);
    }

    @Override
    public Optional<Appointment> findById(int id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> deleteById(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        appointment.ifPresent(appointmentRepository::delete);
        return appointment;
    }

    @Override
    public Appointment updateById(int id, Appointment entity) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(id);
        if (existingAppointment.isPresent()) {
            Appointment toUpdate = existingAppointment.get();
            toUpdate.setDoctor(entity.getDoctor());
            toUpdate.setSlot(entity.getSlot());
            toUpdate.setAppointmentType(entity.getAppointmentType());
            toUpdate.setPatient(entity.getPatient());
            toUpdate.setDateTimeScheduled(entity.getDateTimeScheduled());
            toUpdate.setStatus(entity.getStatus());
            return appointmentRepository.save(toUpdate);
        }
        return null;
    }

    @Transactional
    public Appointment createAppointment(Appointment entity) {
        if (entity.getSlot() == null || entity.getSlot().getSlotId() == null) {
            throw new RuntimeException("Slot is required");
        }
        if (entity.getDoctor() == null || entity.getDoctor().getDoctorId() == null) {
            throw new RuntimeException("Doctor is required");
        }

        TimeSlot slot = timeSlotRepository.findById(entity.getSlot().getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getDoctor() == null || !slot.getDoctor().getDoctorId().equals(entity.getDoctor().getDoctorId())) {
            throw new RuntimeException("Slot does not belong to doctor");
        }

        int booked = timeSlotRepository.bookSlotIfAvailable(slot.getSlotId());
        if (booked == 0) {
            throw new RuntimeException("Slot is not available");
        }

        entity.setSlot(slot);
        entity.setDateTimeScheduled(LocalDateTime.of(slot.getDateAvailable(), slot.getStartTime()));
        if (entity.getStatus() == null) {
            entity.setStatus(AppointmentStatus.CONFIRMED);
        }

        return appointmentRepository.save(entity);
    }

    @Transactional
    public Appointment bookAppointment(Integer slotId, Integer patientId, AppointmentType appointmentType) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("TimeSlot not found"));

        if (slot.getStatus() != TimeSlotStatus.AVAILABLE) {
            throw new RuntimeException("TimeSlot is not available");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseGet(() -> {
                    Patient newPatient = new Patient();
                    newPatient.setPatientId(patientId);
                    return patientRepository.save(newPatient);
                });

        int booked = timeSlotRepository.bookSlotIfAvailable(slot.getSlotId());
        if (booked == 0) {
            throw new RuntimeException("TimeSlot is not available");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(slot.getDoctor());
        appointment.setSlot(slot);
        appointment.setAppointmentType(appointmentType);
        appointment.setPatient(patient);
        appointment.setDateTimeScheduled(LocalDateTime.of(slot.getDateAvailable(), slot.getStartTime()));
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Map<String, Object> createAppointmentFromSlot(Patient patient, Integer slotId, Integer appointmentTypeId) {
        if (patient == null || patient.getPatientId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient is required");
        }
        if (slotId == null || appointmentTypeId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slot and appointment type are required");
        }

        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found"));

        LocalDateTime scheduled = LocalDateTime.of(slot.getDateAvailable(), slot.getStartTime());
        if (!scheduled.isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slot must be in the future");
        }

        AppointmentType appointmentType = appointmentTypeRepository.findById(appointmentTypeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment type not found"));

        int booked = timeSlotRepository.bookSlotIfAvailable(slot.getSlotId());
        if (booked == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot is not available");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(slot.getDoctor());
        appointment.setSlot(slot);
        appointment.setPatient(patient);
        appointment.setAppointmentType(appointmentType);
        appointment.setDateTimeScheduled(scheduled);
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Appointment saved = appointmentRepository.save(appointment);

        Map<String, Object> response = new HashMap<>();
        response.put("appointmentId", saved.getAppointmentId());
        response.put("status", saved.getStatus());
        response.put("doctorId", slot.getDoctor() != null ? slot.getDoctor().getDoctorId() : null);
        if (slot.getDoctor() != null && slot.getDoctor().getUser() != null) {
            String name = slot.getDoctor().getUser().getFirstName() + " " + slot.getDoctor().getUser().getLastName();
            response.put("doctorName", name);
        } else {
            response.put("doctorName", null);
        }
        response.put("patientId", patient.getPatientId());
        response.put("slotId", slot.getSlotId());
        response.put("dateAvailable", slot.getDateAvailable());
        response.put("startTime", slot.getStartTime());
        response.put("endTime", slot.getEndTime());
        response.put("appointmentTypeId", appointmentType.getTypeId());
        response.put("createdAt", saved.getCreatedAt());
        return response;
    }

    @Transactional
    public void cancelAppointment(int appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        TimeSlot slot = appointment.getSlot();
        if (slot != null) {
            timeSlotRepository.freeSlotIfBooked(slot.getSlotId());
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void cancelAppointmentForPatient(Integer patientId, Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        if (appointment.getPatient() == null || !appointment.getPatient().getPatientId().equals(patientId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Appointment does not belong to patient");
        }

        TimeSlot slot = appointment.getSlot();
        if (slot != null) {
            timeSlotRepository.freeSlotIfBooked(slot.getSlotId());
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentDto> getAppointmentsForPatient(Integer patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatient_PatientId(patientId);

        return appointments.stream()
                .map(appt -> new AppointmentDto(
                        appt.getAppointmentId(),
                        "Dr. " + appt.getDoctor().getDoctorId(),
                        appt.getAppointmentType().getName(),
                        appt.getDateTimeScheduled(),
                        appt.getDateTimeScheduled().plusMinutes(30),
                        appt.getStatus()
                ))
                .collect(Collectors.toList());
    }

    public List<Appointment> getConfirmedAppointmentsForPatient(Integer patientId) {
        return appointmentRepository.findByPatient_PatientIdAndStatus(patientId, AppointmentStatus.REQUESTED);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCurrentAppointmentsForPatient(Integer patientId) {
        if (patientId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient ID is required");
        }
        LocalDateTime now = LocalDateTime.now();
        List<Appointment> appointments = appointmentRepository
                .findCurrentForPatientWithDetails(
                        patientId,
                        now,
                        List.of(AppointmentStatus.CANCELLED, AppointmentStatus.DENIED, AppointmentStatus.COMPLETED)
                );
        return toPatientAppointmentViews(appointments);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAppointmentHistoryForPatient(Integer patientId) {
        if (patientId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient ID is required");
        }
        LocalDateTime now = LocalDateTime.now();
        List<Appointment> appointments = appointmentRepository
                .findHistoryForPatientWithDetails(
                        patientId,
                        now,
                        List.of(AppointmentStatus.CANCELLED, AppointmentStatus.DENIED, AppointmentStatus.COMPLETED)
                );
        return toPatientAppointmentViews(appointments);
    }

    private List<Map<String, Object>> toPatientAppointmentViews(List<Appointment> appointments) {
        List<Map<String, Object>> results = new ArrayList<>();
        for (Appointment appointment : appointments) {
            results.add(toPatientAppointmentView(appointment));
        }
        return results;
    }

    private Map<String, Object> toPatientAppointmentView(Appointment appointment) {
        Map<String, Object> view = new HashMap<>();
        view.put("appointmentId", appointment.getAppointmentId());
        view.put("status", appointment.getStatus());

        TimeSlot slot = appointment.getSlot();
        view.put("slotId", slot != null ? slot.getSlotId() : null);
        view.put("dateAvailable", slot != null ? slot.getDateAvailable() : null);
        view.put("startTime", slot != null ? slot.getStartTime() : null);
        view.put("endTime", slot != null ? slot.getEndTime() : null);

        if (slot != null && slot.getDoctor() != null) {
            view.put("doctorId", slot.getDoctor().getDoctorId());
            if (slot.getDoctor().getUser() != null) {
                String name = slot.getDoctor().getUser().getFirstName() + " " + slot.getDoctor().getUser().getLastName();
                view.put("doctorName", name);
            } else {
                view.put("doctorName", null);
            }
        } else {
            view.put("doctorId", null);
            view.put("doctorName", null);
        }

        AppointmentType appointmentType = appointment.getAppointmentType();
        view.put("appointmentTypeId", appointmentType != null ? appointmentType.getTypeId() : null);
        view.put("appointmentType", appointmentType != null ? appointmentType.getName() : null);
        view.put("scheduledDateTime", appointment.getDateTimeScheduled());
        view.put("createdAt", appointment.getCreatedAt());

        return view;
    }
}
