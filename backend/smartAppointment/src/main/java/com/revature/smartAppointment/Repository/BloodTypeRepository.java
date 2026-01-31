package com.revature.smartAppointment.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.revature.smartAppointment.Model.BloodType;

@Repository
public interface BloodTypeRepository extends JpaRepository<BloodType, Integer>{
    Optional<BloodType> findBloodTypeByName(String name);
}   
