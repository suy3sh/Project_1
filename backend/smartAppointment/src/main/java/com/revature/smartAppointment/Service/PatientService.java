package com.revature.smartAppointment.Service;

import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.smartAppointment.Controller.Request.PatientInfoRequest;
import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Repository.PatientRepository;

@Service
public class PatientService implements ServiceInterface<Patient> {
    private PatientRepository patientRepository;
    private BloodTypeService bloodTypeService;
    private AllergyService allergyService;

    @Autowired
    public PatientService(PatientRepository patientRepository, BloodTypeService bloodTypeService, AllergyService allergyService) {
        this.patientRepository = patientRepository;
        this.bloodTypeService = bloodTypeService;
        this.allergyService = allergyService;
    }
     
    @Override
    public Patient save(Patient entity) {
        return patientRepository.save(entity);
    }

    @Override
    @Transactional
    public Optional<Patient> findById(int id) {
        return patientRepository.findById(id);
    }

    @Override
    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    @Override
    public Optional<Patient> deleteById(int id) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isPresent()) {
            patientRepository.deleteById(id);
        }
        return optionalPatient;
    }

    @Override
    public Patient updateById(int id, Patient newPatient) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isPresent()) {
            Patient patient = optionalPatient.get();
            if (newPatient.getAge() != null) patient.setAge(newPatient.getAge());
            if (newPatient.getGender() != null) patient.setGender(newPatient.getGender());
            if (newPatient.getPhoneNumber() != null) patient.setPhoneNumber(newPatient.getPhoneNumber());
            if (newPatient.getDateOfBirth() != null) patient.setDateOfBirth(newPatient.getDateOfBirth());
            if (newPatient.getAddress() != null) patient.setAddress(newPatient.getAddress());
            if (newPatient.getBloodType() != null) patient.setBloodType(newPatient.getBloodType());
            if (newPatient.getAllergies() != null) patient.setAllergies(newPatient.getAllergies());

            return patientRepository.save(patient);
        }
        return null;
    }
     
    @Transactional
    public Patient updatePatientByUserId(int userId, PatientInfoRequest info) {

        Patient patient = patientRepository
            .findPatientByUser_UserId(userId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));

        // -------- Basic fields --------
        patient.setAge(info.getAge());
        patient.setAddress(info.getAddress());
        patient.setGender(info.getGender());
        patient.setPhoneNumber(info.getPhoneNumber());
        patient.setDateOfBirth(info.getDateOfBirth());

        // -------- NEW fields --------
        patient.setNoAllergies(info.isNoAllergies());
        patient.setDrugAllergies(info.getDrugAllergies());

        // -------- Blood Type (CRITICAL FIX) --------
        patient.setBloodType(
            bloodTypeService
                .findBloodTypeByName(info.getBloodType())
                .orElseThrow(() -> new RuntimeException("Invalid blood type"))
        );

        // -------- Allergies (CRITICAL FIX) --------
        if (info.isNoAllergies()) {
            patient.getAllergies().clear();
        } else {
            List<Allergy> allergyList = new ArrayList<>();

            for (String allergyName : info.getAllergies()) {
                Allergy allergy = allergyService
                    .findAllergyByName(allergyName)
                    .orElseThrow(() -> new RuntimeException("Invalid allergy"));
                allergyList.add(allergy);
            }

            patient.setAllergies(allergyList);
        }

        return patientRepository.save(patient);
    }


    @Transactional
    public Optional<Patient> findByUserId(int user_id) {
        return patientRepository.findPatientByUser_UserId(user_id);
    }

    public Patient convertRequestToObject(PatientInfoRequest info){
        
        Patient patient = new Patient();

        patient.setAge(info.getAge());
        patient.setAddress(info.getAddress());
        patient.setDateOfBirth(info.getDateOfBirth());
        patient.setGender(info.getGender());
        patient.setPhoneNumber(info.getPhoneNumber());

        patient.setBloodType(bloodTypeService.findBloodTypeByName(info.getBloodType()).get());

        List<Allergy> allergyList = new ArrayList<>();

        for (String allergyName : info.getAllergies()){
            Allergy allergy = allergyService.findAllergyByName(allergyName).get();
            allergyList.add(allergy);
        }

        patient.setAllergies(allergyList);
        
        return patient;
    }
}
