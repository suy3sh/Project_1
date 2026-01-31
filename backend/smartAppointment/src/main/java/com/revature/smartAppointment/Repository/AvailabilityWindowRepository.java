package com.revature.smartAppointment.Repository;
import org.springframework.data.jpa.repository.Query;
import com.revature.smartAppointment.Model.AvailabilityWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.repository.query.Param;


public interface AvailabilityWindowRepository
        extends JpaRepository<AvailabilityWindow, Integer> {

              // Old method
    // List<AvailabilityWindow> findByDoctor_DoctorIdAndActiveTrue(Integer doctorId);

    // New method with fetch join
    @Query("SELECT aw FROM AvailabilityWindow aw " +
           "JOIN FETCH aw.doctor d " +
           "JOIN FETCH d.user u " +
           "WHERE d.doctorId = :doctorId AND aw.active = true")
    List<AvailabilityWindow> findActiveWindowsByDoctorIdWithDoctor(@Param("doctorId") Integer doctorId);

}

