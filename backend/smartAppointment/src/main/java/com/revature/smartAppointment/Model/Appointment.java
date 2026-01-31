package com.revature.smartAppointment.Model;

import java.time.LocalDateTime;

import com.revature.smartAppointment.Model.enums.AppointmentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private TimeSlot slot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private AppointmentType appointmentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "date_time_scheduled")
    private LocalDateTime dateTimeScheduled;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AppointmentStatus status;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = AppointmentStatus.CONFIRMED;
    }

    public Appointment(Doctor doctor, TimeSlot slot, AppointmentType appointmentType, Patient patient, LocalDateTime dateTimeScheduled) {
        this.doctor = doctor;
        this.slot = slot;
        this.appointmentType = appointmentType;
        this.patient = patient;
        this.dateTimeScheduled = dateTimeScheduled;
    }
}
