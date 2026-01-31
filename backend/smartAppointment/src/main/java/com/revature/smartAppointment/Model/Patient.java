package com.revature.smartAppointment.Model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Integer patientId;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address")
    private String address;

    @Column(nullable = false)
    private boolean noAllergies;

    @Column(length = 255)
    private String drugAllergies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_type_id")
    private BloodType bloodType;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "patient_allergies",
            joinColumns = @JoinColumn(name = "patient_id"),
            inverseJoinColumns = @JoinColumn(name = "allergy_id")
    )
    private List<Allergy> allergies = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    public Patient(Integer age, String gender, String phoneNumber, LocalDate dateOfBirth, String address, BloodType bloodType, List<Allergy> allergies) {
        this.age = age;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.bloodType = bloodType;
        this.allergies = allergies;
    }
}