package com.revature.smartAppointment.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "allergy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Allergy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allergy_id")
    private Integer allergyId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public Allergy(String name) {
        this.name = name;
    }
}