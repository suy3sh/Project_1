package com.revature.smartAppointment.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "blood_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blood_type_id")
    private Integer bloodTypeId;

    @Column(name = "name")
    private String name;

    public BloodType(String name){
        this.name = name;
    }
}
