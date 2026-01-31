package com.revature.smartAppointment.Model;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Integer doctorId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "gender")
    private String gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @Column(name = "bio", length = 1000)
    private String bio;

      //  Add this for slots
   /*  @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TimeSlot> slots = new ArrayList<>();*/

    public Doctor (User user, Integer experienceYears, String gender, Speciality speciality, String bio){
        this.user = user;
        this.experienceYears = experienceYears;
        this.gender = gender;
        this.speciality = speciality;
        this.bio = bio;
    }
}