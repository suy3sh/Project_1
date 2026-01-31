package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Repository.AllergyRepository;
import com.revature.smartAppointment.Service.AllergyService;

@ExtendWith(MockitoExtension.class)
class AllergyServiceTest {

    @Mock
    private AllergyRepository allergyRepository;

    @InjectMocks
    private AllergyService allergyService;

    @Test
    @DisplayName("save")
    void save_success() {
        Allergy allergy = new Allergy();
        allergy.setName("Peanuts");

        when(allergyRepository.save(allergy)).thenReturn(allergy);

        Allergy saved = allergyService.save(allergy);

        assertEquals("Peanuts", saved.getName());
        verify(allergyRepository).save(allergy);
    }

    @Test
    @DisplayName("findById")
    void findById_found() {
        Allergy allergy = new Allergy();
        allergy.setAllergyId(1);

        when(allergyRepository.findById(1))
            .thenReturn(Optional.of(allergy));

        Optional<Allergy> result = allergyService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getAllergyId());
    }

    @Test
    void findById_notFound() {
        when(allergyRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Allergy> result = allergyService.findById(1);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("findAll")
    void findAll_success() {
        when(allergyRepository.findAll())
            .thenReturn(List.of(new Allergy(), new Allergy()));

        List<Allergy> result = allergyService.findAll();

        assertEquals(2, result.size());
        verify(allergyRepository).findAll();
    }

    @Test
    @DisplayName("deleteById")
    void deleteById_notSupported_returnsEmpty() {
        Optional<Allergy> result = allergyService.deleteById(1);

        assertTrue(result.isEmpty());
        verifyNoInteractions(allergyRepository);
    }

    @Test
    @DisplayName("updateById")
    void updateById_notSupported_returnsNull() {
        Allergy result = allergyService.updateById(1, new Allergy());

        assertNull(result);
        verifyNoInteractions(allergyRepository);
    }

    @Test
    @DisplayName("findAllergyByName")
    void findAllergyByName_found() {
        Allergy allergy = new Allergy();
        allergy.setName("Peanuts");

        when(allergyRepository.findAllergyByName("Peanuts"))
            .thenReturn(Optional.of(allergy));

        Optional<Allergy> result =
            allergyService.findAllergyByName("Peanuts");

        assertTrue(result.isPresent());
        assertEquals("Peanuts", result.get().getName());
    }

    @Test
    void findAllergyByName_notFound() {
        when(allergyRepository.findAllergyByName("Shellfish"))
            .thenReturn(Optional.empty());

        Optional<Allergy> result =
            allergyService.findAllergyByName("Shellfish");

        assertTrue(result.isEmpty());
    }
}
