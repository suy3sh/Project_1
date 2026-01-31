package com.revature.smartAppointment.Controller;
import com.revature.smartAppointment.Model.Appointment;
import com.revature.smartAppointment.Model.AppointmentType;
import com.revature.smartAppointment.Model.Doctor;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Model.TimeSlot;
import com.revature.smartAppointment.Model.enums.TimeSlotStatus;
import com.revature.smartAppointment.dto.AppointmentDto;
import com.revature.smartAppointment.dto.BookAppointmentRequestDto;
import com.revature.smartAppointment.dto.DoctorAvailabilityDto;
import com.revature.smartAppointment.dto.SlotDto;

import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import com.revature.smartAppointment.Service.AppointmentService;
import com.revature.smartAppointment.Service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.smartAppointment.Repository.AppointmentRepository;
import com.revature.smartAppointment.Repository.AppointmentTypeRepository;
import com.revature.smartAppointment.Repository.DoctorRepository;
import com.revature.smartAppointment.Repository.TimeSlotRepository;


@RestController
@RequestMapping("/smart-appointment/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    private AppointmentTypeRepository appointmentTypeRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private TimeSlotRepository timeSlotRepository;
    
    private PatientService patientService;


    @Autowired
    public AppointmentController(AppointmentService appointmentService, PatientService patientSerivice) {
        this.appointmentService = appointmentService;
        this.patientService = patientSerivice;
    }

    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<AppointmentDto> bookAppointment(@RequestBody BookAppointmentRequestDto request) {
        AppointmentType type = appointmentTypeRepository.findById(request.typeId())
            .orElseThrow(() -> new RuntimeException("AppointmentType not found"));
        
        Optional<Patient> optionalPatient = patientService.findByUserId(request.patientId());
        if (optionalPatient.isPresent()) {
            Appointment appointment = appointmentService.bookAppointment(request.slotId(), optionalPatient.get().getPatientId(), type);
            AppointmentDto response = new AppointmentDto(
                appointment.getAppointmentId(),
                "Dr. " + appointment.getDoctor().getDoctorId(),
                appointment.getAppointmentType().getName(),
                appointment.getDateTimeScheduled(),
                appointment.getDateTimeScheduled().plusMinutes(30),
                appointment.getStatus()
            );
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // Get patient appointments
    @GetMapping("/patient/{patientId}")
    public List<AppointmentDto> getPatientAppointments(@PathVariable Integer patientId) {
        Optional<Patient> optionalPatient = patientService.findByUserId(patientId);

        if (optionalPatient.isEmpty()) {
            return new ArrayList<AppointmentDto>();
        }
        List<Appointment> appointments = appointmentRepository.findByPatient_PatientId(optionalPatient.get().getPatientId());

        return appointments.stream()
            .map(app -> new AppointmentDto(
                app.getAppointmentId(),
                app.getDoctor().getUser().getFirstName() + " " + app.getDoctor().getUser().getLastName(),
                app.getAppointmentType().getName(),
                app.getDateTimeScheduled(),
                app.getDateTimeScheduled().plusMinutes(30),
                app.getStatus()
            ))
            .collect(Collectors.toList());
    }

    // ================= Get doctor availability =================
    @GetMapping("/availability")
    public Map<String, List<DoctorAvailabilityDto>> getAvailability() {
        
        Map<String, List<DoctorAvailabilityDto>> availabilityByDate = new HashMap<>();

        List<Doctor> doctors = doctorRepository.findAll();

        for (Doctor doctor : doctors) {

             // Fetch only available slots for this doctor
        List<TimeSlot> slots = timeSlotRepository.findByDoctor_DoctorIdAndStatusOrderByDateAvailableAscStartTimeAsc(
                doctor.getDoctorId(), TimeSlotStatus.AVAILABLE
        );

        // Group slots by date
        Map<String, List<SlotDto>> slotsByDate = new HashMap<>();
        for (TimeSlot slot : slots) {
            String dateKey = slot.getDateAvailable().toString();

            SlotDto slotDto = new SlotDto();
            slotDto.setSlotId(slot.getSlotId());
            slotDto.setStartTime(slot.getStartTime().toString());
            slotDto.setEndTime(slot.getEndTime().toString());
            slotDto.setAvailable(true);

            slotsByDate.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(slotDto);
        }
         for (Map.Entry<String, List<SlotDto>> entry : slotsByDate.entrySet()) {
            String dateKey = entry.getKey();
            List<SlotDto> doctorSlots = entry.getValue();

            DoctorAvailabilityDto doctorDto = new DoctorAvailabilityDto();
            doctorDto.setDoctorId(doctor.getDoctorId());
            doctorDto.setDoctorName(
                doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName()
            );
            doctorDto.setSpecialization(doctor.getSpeciality().getSpecialityName());
            doctorDto.setSlots(doctorSlots);

            availabilityByDate.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(doctorDto);
        }
    }
    return availabilityByDate;
}
}