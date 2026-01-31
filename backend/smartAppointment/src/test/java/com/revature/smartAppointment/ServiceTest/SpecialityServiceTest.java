package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import com.revature.smartAppointment.Model.Speciality;
import com.revature.smartAppointment.Repository.SpecialityRepository;
import com.revature.smartAppointment.Service.SpecialityService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SpecialityServiceTest {

    @Mock
    private SpecialityRepository specialityRepository;

    @InjectMocks
    private SpecialityService specialityService;

    @Test
    @DisplayName("save")
    void save_success() {
        Speciality speciality = new Speciality();
        speciality.setSpecialityName("Cardiology");

        when(specialityRepository.save(speciality)).thenReturn(speciality);

        Speciality saved = specialityService.save(speciality);

        assertNotNull(saved);
        assertEquals("Cardiology", saved.getSpecialityName());
        verify(specialityRepository).save(speciality);
    }

    @Test
    @DisplayName("findById")
    void findById_found() {
        Speciality speciality = new Speciality();
        speciality.setSpecialityId(1);

        when(specialityRepository.findById(1)).thenReturn(Optional.of(speciality));

        Optional<Speciality> result = specialityService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getSpecialityId());
    }

    @Test
    void findById_notFound() {
        when(specialityRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Speciality> result = specialityService.findById(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("findAll")
    void findAll_returnsList() {
        when(specialityRepository.findAll()).thenReturn(List.of(
                new Speciality(), new Speciality()
        ));

        List<Speciality> result = specialityService.findAll();

        assertEquals(2, result.size());
        verify(specialityRepository).findAll();
    }

    @Test
    @DisplayName("deleteById (not implemented)")
    void deleteById_alwaysEmpty() {
        Optional<Speciality> result = specialityService.deleteById(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("updateById (not implemented)")
    void updateById_alwaysNull() {
        Speciality speciality = new Speciality();
        Speciality result = specialityService.updateById(1, speciality);

        assertNull(result);
    }

    @Test
    @DisplayName("findSpecialityBySpecialityName")
    void findSpecialityBySpecialityName_found() {
        Speciality speciality = new Speciality();
        speciality.setSpecialityName("Neurology");

        when(specialityRepository.findSpecialityBySpecialityName("Neurology"))
                .thenReturn(Optional.of(speciality));

        Optional<Speciality> result = specialityService.findSpecialityBySpecialityName("Neurology");

        assertTrue(result.isPresent());
        assertEquals("Neurology", result.get().getSpecialityName());
    }

    @Test
    void findSpecialityBySpecialityName_notFound() {
        when(specialityRepository.findSpecialityBySpecialityName("Oncology"))
                .thenReturn(Optional.empty());

        Optional<Speciality> result = specialityService.findSpecialityBySpecialityName("Oncology");

        assertTrue(result.isEmpty());
    }
}
