package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Controller.Request.PatientInfoRequest;
import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Model.BloodType;
import com.revature.smartAppointment.Model.Patient;
import com.revature.smartAppointment.Repository.PatientRepository;
import com.revature.smartAppointment.Service.AllergyService;
import com.revature.smartAppointment.Service.BloodTypeService;
import com.revature.smartAppointment.Service.PatientService;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private BloodTypeService bloodTypeService;

    @Mock
    private AllergyService allergyService;

    @InjectMocks
    private PatientService patientService;

    @Test
    @DisplayName("save")
    void save_success() {
        Patient patient = new Patient();

        when(patientRepository.save(patient))
            .thenReturn(patient);

        Patient saved = patientService.save(patient);

        assertNotNull(saved);
        verify(patientRepository).save(patient);
    }

    @Test
    @DisplayName("findById")
    void findById_found() {
        Patient patient = new Patient();
        patient.setPatientId(1);

        when(patientRepository.findById(1))
            .thenReturn(Optional.of(patient));

        Optional<Patient> result = patientService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getPatientId());
    }

    @Test
    void findById_notFound() {
        when(patientRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Patient> result = patientService.findById(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("findAll")
    void findAll_success() {
        when(patientRepository.findAll())
            .thenReturn(List.of(new Patient(), new Patient()));

        List<Patient> result = patientService.findAll();

        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("deleteById")
    void deleteById_found_deletes() {
        Patient patient = new Patient();
        patient.setPatientId(1);

        when(patientRepository.findById(1))
            .thenReturn(Optional.of(patient));

        Optional<Patient> result =
            patientService.deleteById(1);

        assertTrue(result.isPresent());
        verify(patientRepository).deleteById(1);
    }

    @Test
    void deleteById_notFound() {
        when(patientRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Patient> result =
            patientService.deleteById(1);

        assertTrue(result.isEmpty());
        verify(patientRepository, never()).deleteById(anyInt());
    }

    @Test
    @DisplayName("updateById")
    void updateById_success_partialUpdate() {
        Patient existing = new Patient();
        existing.setPatientId(1);
        existing.setPhoneNumber("123");

        Patient updates = new Patient();
        updates.setPhoneNumber("456");

        when(patientRepository.findById(1))
            .thenReturn(Optional.of(existing));
        when(patientRepository.save(existing))
            .thenReturn(existing);

        Patient result =
            patientService.updateById(1, updates);

        assertNotNull(result);
        assertEquals("456", result.getPhoneNumber());
        verify(patientRepository).save(existing);
    }

    @Test
    void updateById_notFound() {
        when(patientRepository.findById(1))
            .thenReturn(Optional.empty());

        Patient result =
            patientService.updateById(1, new Patient());

        assertNull(result);
        verify(patientRepository, never()).save(any());
    }

    @Test
    @DisplayName("findByUserId")
    void findByUserId_found() {
        Patient patient = new Patient();

        when(patientRepository.findPatientByUser_UserId(10))
            .thenReturn(Optional.of(patient));

        Optional<Patient> result =
            patientService.findByUserId(10);

        assertTrue(result.isPresent());
    }

    @Test
    void findByUserId_notFound() {
        when(patientRepository.findPatientByUser_UserId(10))
            .thenReturn(Optional.empty());

        Optional<Patient> result =
            patientService.findByUserId(10);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("convertRequestToObject")
    void convertRequestToObject_success_mapsFieldsAndRelations() {
        PatientInfoRequest request = new PatientInfoRequest();
        request.setAge(30);
        request.setGender("Male");
        request.setPhoneNumber("555-1234");
        request.setAddress("123 Main St");
        request.setDateOfBirth(LocalDate.of(1994, 1, 1));
        request.setBloodType("O+");
        request.setAllergies(List.of("Peanuts", "Dust").toArray(new String[0]));

        BloodType bloodType = new BloodType();
        bloodType.setName("O+");

        Allergy peanuts = new Allergy();
        peanuts.setName("Peanuts");

        Allergy dust = new Allergy();
        dust.setName("Dust");

        when(bloodTypeService.findBloodTypeByName("O+"))
            .thenReturn(Optional.of(bloodType));
        when(allergyService.findAllergyByName("Peanuts"))
            .thenReturn(Optional.of(peanuts));
        when(allergyService.findAllergyByName("Dust"))
            .thenReturn(Optional.of(dust));

        Patient patient =
            patientService.convertRequestToObject(request);

        assertEquals(30, patient.getAge());
        assertEquals("Male", patient.getGender());
        assertEquals("555-1234", patient.getPhoneNumber());
        assertEquals("123 Main St", patient.getAddress());
        assertEquals(bloodType, patient.getBloodType());
        assertEquals(2, patient.getAllergies().size());
    }
}