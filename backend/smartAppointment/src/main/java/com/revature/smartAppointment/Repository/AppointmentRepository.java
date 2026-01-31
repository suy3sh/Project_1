package com.revature.smartAppointment.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.enums.AppointmentStatus;
import com.revature.smartAppointment.dto.DoctorAppointmentView;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

      List<Appointment> findBySlotDoctorDoctorIdAndDateTimeScheduledBetween(
            Integer doctorId,
            LocalDateTime start,
            LocalDateTime end
      );

      

      List<Appointment> findBySlotDoctorDoctorIdAndDateTimeScheduledAfter(
                  Integer doctorId,
                  LocalDateTime start
      );

      List<Appointment> findByPatient_PatientId(Integer patientId);

      List<Appointment> findByPatient_PatientIdAndStatus(Integer patientId, AppointmentStatus status);

      List<Appointment> findBySlotDoctorDoctorIdOrderByDateTimeScheduledAsc(Integer doctorId);

      @Query("""
            SELECT new com.revature.smartAppointment.dto.DoctorAppointmentView(
                  p.user.firstName,
                  p.user.lastName,
                  p.age,
                  a.dateTimeScheduled,
                  a.status
            )
            FROM Appointment a
            JOIN a.patient p
            JOIN a.slot s
            WHERE s.doctor.doctorId = :doctorId
            AND FUNCTION('DATE', a.dateTimeScheduled) = :date
      """)
      List<DoctorAppointmentView> findAppointmentsForDoctorByDate(
                  @Param("doctorId") Integer doctorId,
                  @Param("date") LocalDate date
      );

      List<Appointment> findByPatientPatientIdAndDateTimeScheduledGreaterThanEqualOrderByDateTimeScheduledAsc(
                  Integer patientId,
                  LocalDateTime start
      );

      List<Appointment> findByPatientPatientIdAndDateTimeScheduledLessThanOrderByDateTimeScheduledDesc(
                  Integer patientId,
                  LocalDateTime end
      );

      @Query("""
                  SELECT DISTINCT a
                  FROM Appointment a
                  JOIN FETCH a.slot s
                  JOIN FETCH s.doctor d
                  JOIN FETCH d.user u
                  JOIN FETCH a.appointmentType t
                  JOIN FETCH a.patient p
                  JOIN FETCH p.user pu
                  WHERE a.patient.patientId = :patientId
                  AND a.dateTimeScheduled >= :now
                  AND a.status NOT IN :excludedStatuses
                  ORDER BY a.dateTimeScheduled ASC
                  """)
      List<Appointment> findCurrentForPatientWithDetails(
                  @Param("patientId") Integer patientId,
                  @Param("now") LocalDateTime now,
                  @Param("excludedStatuses") List<AppointmentStatus> excludedStatuses
      );

      @Query("""
                  SELECT DISTINCT a
                  FROM Appointment a
                  JOIN FETCH a.slot s
                  JOIN FETCH s.doctor d
                  JOIN FETCH d.user u
                  JOIN FETCH a.appointmentType t
                  JOIN FETCH a.patient p
                  JOIN FETCH p.user pu
                  WHERE a.patient.patientId = :patientId
                  AND (a.dateTimeScheduled < :now OR a.status IN :historyStatuses)
                  ORDER BY a.dateTimeScheduled DESC
                  """)
      List<Appointment> findHistoryForPatientWithDetails(
                  @Param("patientId") Integer patientId,
                  @Param("now") LocalDateTime now,
                  @Param("historyStatuses") List<AppointmentStatus> historyStatuses
      );

      @Query("""
                  SELECT DISTINCT a
                  FROM Appointment a
                  JOIN FETCH a.slot s
                  JOIN FETCH s.doctor d
                  JOIN FETCH d.user u
                  JOIN FETCH a.appointmentType t
                  JOIN FETCH a.patient p
                  JOIN FETCH p.user pu
                  ORDER BY a.dateTimeScheduled DESC
                  """)
      List<Appointment> findAllWithDetails();

      @Query("""
                  SELECT DISTINCT a
                  FROM Appointment a
                  JOIN FETCH a.slot s
                  JOIN FETCH s.doctor d
                  JOIN FETCH d.user u
                  JOIN FETCH a.appointmentType t
                  JOIN FETCH a.patient p
                  JOIN FETCH p.user pu
                  WHERE a.status = :status
                  ORDER BY a.dateTimeScheduled DESC
                  """)
      List<Appointment> findByStatusWithDetails(@Param("status") AppointmentStatus status);
}
