package com.revature.smartAppointment.Model;
import java.time.LocalDateTime;

import com.revature.smartAppointment.Model.enums.AppointmentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="appointments")
@NoArgsConstructor 
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private int appointmentId;
    @Column(name ="slot_id")
    private int slotId;
    @Column(name="type_id")
    private int typeId;
    @Column(name="patient_id")
    private int patientId;
    @Column(name="created_at")
    private LocalDateTime createdAt;
    @Column(name="date_time_scheduled")
    private LocalDateTime dateTimeScheduled;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AppointmentStatus status;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = AppointmentStatus.REQUESTED;
    } 
}
