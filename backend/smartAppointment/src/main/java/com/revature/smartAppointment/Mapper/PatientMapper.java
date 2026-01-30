package com.revature.smartAppointment.Mapper;

import org.springframework.stereotype.Component;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.dto.PatientResponse;

@Component
public class PatientMapper {
    public PatientResponse toResponse(Patient patient) {
        PatientResponse resp = new PatientResponse();
        resp.setPatientId(patient.getPatientId());
        resp.setAge(patient.getAge());
        resp.setGender(patient.getGender());
        resp.setPhoneNumber(patient.getPhoneNumber());
        resp.setDateOfBirth(patient.getDateOfBirth());
        resp.setAddress(patient.getAddress());
        resp.setNoAllergies(patient.isNoAllergies());
        resp.setDrugAllergies(patient.getDrugAllergies());
        resp.setBloodType(patient.getBloodType());
        resp.setAllergies(patient.getAllergies());
        return resp;
    }
}
