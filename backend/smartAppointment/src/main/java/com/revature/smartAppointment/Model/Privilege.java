package com.revature.smartAppointment.Model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "privilege")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Privilege {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "privilege_id")
    private int privilegeId;
    @Column(name = "role_name")
    private String roleName;
}
