package com.revature.smartAppointment.Repository;

import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findPatientByUser_UserId(int userId);
}
