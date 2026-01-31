package com.revature.smartAppointment.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.revature.smartAppointment.Model.AppointmentType;

@Repository
public interface AppointmentTypeRepository extends JpaRepository<AppointmentType, Integer> {}
