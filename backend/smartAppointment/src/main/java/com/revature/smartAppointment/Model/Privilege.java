package com.revature.smartAppointment.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "privilege")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "privilege_id")
    private Integer privilegeId;

    @Column(name = "role_name", nullable = false, unique = true)
    private String roleName;

    public Privilege(String roleName) {
        this.roleName = roleName;
    }
}