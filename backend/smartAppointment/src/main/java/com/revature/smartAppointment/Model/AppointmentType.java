package com.revature.smartAppointment.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointment_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Integer typeId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "estimated_time")
    private Integer estimatedTime; // minutes

    @Column(name = "description")
    private String description;

    public AppointmentType(String name, Integer estimatedTime, String description) {
        this.name = name;
        this.estimatedTime = estimatedTime;
        this.description = description;
    }
}