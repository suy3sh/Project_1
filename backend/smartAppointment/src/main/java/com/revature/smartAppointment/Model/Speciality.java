package com.revature.smartAppointment.Model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "speciality")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Speciality {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "speciality_id")
    private Integer specialityId;

    @Column(name = "speciality_name", nullable = false, unique = true)
    private String specialityName;

    @Column(name = "description")
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "speciality_appointment_type",
            joinColumns = @JoinColumn(name = "speciality_id"),
            inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    private List<AppointmentType> appointmentTypes = new ArrayList<>();

    public Speciality(String specialityName, String description) {
        this.specialityName = specialityName;
        this.description = description;
    }
}