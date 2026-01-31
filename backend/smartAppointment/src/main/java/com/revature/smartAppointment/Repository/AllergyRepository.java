package com.revature.smartAppointment.Repository;

import com.revature.smartAppointment.Model.Allergy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AllergyRepository extends JpaRepository<Allergy, Integer> {
    Optional<Allergy> findAllergyByName(String name);
}
