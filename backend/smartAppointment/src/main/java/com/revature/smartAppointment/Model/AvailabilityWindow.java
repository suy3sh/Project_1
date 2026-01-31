package com.revature.smartAppointment.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "availability_window")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityWindow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "window_id")
    private Integer windowId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "available_date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "active")
    private boolean active = true;
}
