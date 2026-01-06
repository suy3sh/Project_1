package com.revature.smartAppointment.Model;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name="users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    private String email;
    private String password;
    private String first_name;
    private String last_name;
    private int privilege_id;
}
