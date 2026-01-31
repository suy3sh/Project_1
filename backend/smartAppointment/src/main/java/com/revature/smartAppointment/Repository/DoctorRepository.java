package com.revature.smartAppointment.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revature.smartAppointment.Model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findDoctorByUser_UserId(Integer userId);
}
//findbyUserUser
