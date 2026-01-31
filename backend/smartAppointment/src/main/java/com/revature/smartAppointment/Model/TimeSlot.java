package com.revature.smartAppointment.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.revature.smartAppointment.Model.enums.TimeSlotStatus;

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
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "time_slot", 
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"doctor_id", "date_available", "start_time"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Integer slotId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "date_available", nullable = false)
    private LocalDate dateAvailable;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TimeSlotStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = TimeSlotStatus.AVAILABLE;
        if (startTime != null) {
            LocalTime expectedEnd = startTime.plusMinutes(30);
            if (endTime == null || !endTime.equals(expectedEnd)) {
                endTime = expectedEnd;
            }
        }
    }

    // Constructor used by the Service to generate slots
    public TimeSlot(Doctor doctor, LocalDate dateAvailable, LocalTime startTime, LocalTime endTime) {
        this.doctor = doctor;
        this.dateAvailable = dateAvailable;
        this.startTime = startTime;
        this.endTime = startTime != null ? startTime.plusMinutes(30) : endTime;
        this.status = TimeSlotStatus.AVAILABLE;
    }

    public TimeSlot(LocalTime startTime, LocalTime endTime, LocalDate dateAvailable, Doctor doctor) {
        this.doctor = doctor;
        this.dateAvailable = dateAvailable;
        this.startTime = startTime;
        this.endTime = startTime != null ? startTime.plusMinutes(30) : endTime;
        this.status = TimeSlotStatus.AVAILABLE;
    }
}
