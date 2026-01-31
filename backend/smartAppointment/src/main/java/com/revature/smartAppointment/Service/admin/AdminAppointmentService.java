package com.revature.smartAppointment.Service.admin;

import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminAppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Autowired
    public AdminAppointmentService(AppointmentRepository appointmentRepository, TimeSlotRepository timeSlotRepository) {
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    //  View all appointments
    public List<Map<String, Object>> getAppointments(String status) {
        List<Appointment> appointments;
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            appointments = appointmentRepository.findAllWithDetails();
        } else {
            try {
                AppointmentStatus desired = AppointmentStatus.valueOf(status.toUpperCase());
                appointments = appointmentRepository.findByStatusWithDetails(desired);
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
            }
        }
        return toAdminAppointmentViews(appointments);
    }

    //  Update appointment status
    public Map<String, Object> updateStatus(Integer id, AppointmentStatus status) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appt.setStatus(status);
        if (status == AppointmentStatus.CANCELLED || status == AppointmentStatus.DENIED) {
            TimeSlot slot = appt.getSlot();
            if (slot != null) {
                timeSlotRepository.freeSlotIfBooked(slot.getSlotId());
            }
        }
        Appointment saved = appointmentRepository.save(appt);
        return toAdminAppointmentView(saved);
    }

    //  Reschedule appointment using a TimeSlot
    public Map<String, Object> reschedule(Integer appointmentId, LocalDateTime newDateTime) {
        Appointment appt = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appt.setDateTimeScheduled(newDateTime);
        Appointment saved = appointmentRepository.save(appt);
        return toAdminAppointmentView(saved);
    }

    private List<Map<String, Object>> toAdminAppointmentViews(List<Appointment> appointments) {
        List<Map<String, Object>> results = new ArrayList<>();
        for (Appointment appointment : appointments) {
            results.add(toAdminAppointmentView(appointment));
        }
        return results;
    }

    private Map<String, Object> toAdminAppointmentView(Appointment appointment) {
        Map<String, Object> view = new HashMap<>();
        view.put("appointmentId", appointment.getAppointmentId());
        view.put("status", appointment.getStatus());
        view.put("scheduledDateTime", appointment.getDateTimeScheduled());
        view.put("createdAt", appointment.getCreatedAt());

        if (appointment.getPatient() != null) {
            view.put("patientId", appointment.getPatient().getPatientId());
            if (appointment.getPatient().getUser() != null) {
                String name = appointment.getPatient().getUser().getFirstName() + " " + appointment.getPatient().getUser().getLastName();
                view.put("patientName", name);
            }
        }

        if (appointment.getSlot() != null) {
            view.put("slotId", appointment.getSlot().getSlotId());
            view.put("dateAvailable", appointment.getSlot().getDateAvailable());
            view.put("startTime", appointment.getSlot().getStartTime());
            view.put("endTime", appointment.getSlot().getEndTime());
            if (appointment.getSlot().getDoctor() != null) {
                view.put("doctorId", appointment.getSlot().getDoctor().getDoctorId());
                if (appointment.getSlot().getDoctor().getUser() != null) {
                    String name = appointment.getSlot().getDoctor().getUser().getFirstName() + " " + appointment.getSlot().getDoctor().getUser().getLastName();
                    view.put("doctorName", name);
                }
            }
        }

        if (appointment.getAppointmentType() != null) {
            view.put("appointmentTypeId", appointment.getAppointmentType().getTypeId());
            view.put("appointmentType", appointment.getAppointmentType().getName());
        }

        return view;
    }
}
