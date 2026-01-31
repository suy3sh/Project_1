package com.revature.smartAppointment.ServiceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.revature.smartAppointment.Model.Privilege;
import com.revature.smartAppointment.Repository.PrivilegeRepository;
import com.revature.smartAppointment.Service.PrivilegeService;

@ExtendWith(MockitoExtension.class)
class PrivilegeServiceTest {

    @Mock
    private PrivilegeRepository privilegeRepository;

    @InjectMocks
    private PrivilegeService privilegeService;

    @Test
    @DisplayName("save")
    void save_success() {
        Privilege privilege = new Privilege();
        privilege.setRoleName("ADMIN");

        when(privilegeRepository.save(privilege)).thenReturn(privilege);

        Privilege saved = privilegeService.save(privilege);

        assertEquals("ADMIN", saved.getRoleName());
        verify(privilegeRepository).save(privilege);
    }


    @Test
    @DisplayName("findById")
    void findById_found() {
        Privilege privilege = new Privilege();
        privilege.setPrivilegeId(1);

        when(privilegeRepository.findById(1))
            .thenReturn(Optional.of(privilege));

        Optional<Privilege> result = privilegeService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getPrivilegeId());
    }

    @Test
    void findById_notFound() {
        when(privilegeRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Privilege> result = privilegeService.findById(1);

        assertTrue(result.isEmpty());
    }


    @Test
    @DisplayName("findAll")
    void findAll_success() {
        when(privilegeRepository.findAll())
            .thenReturn(List.of(new Privilege(), new Privilege()));

        List<Privilege> result = privilegeService.findAll();

        assertEquals(2, result.size());
    }


    @Test
    @DisplayName("deleteById")
    void deleteById_found_deletesAndReturns() {
        Privilege privilege = new Privilege();
        privilege.setPrivilegeId(1);

        when(privilegeRepository.findById(1))
            .thenReturn(Optional.of(privilege));

        Optional<Privilege> result = privilegeService.deleteById(1);

        assertTrue(result.isPresent());
        verify(privilegeRepository).deleteById(1);
    }

    @Test
    void deleteById_notFound_returnsEmpty() {
        when(privilegeRepository.findById(1))
            .thenReturn(Optional.empty());

        Optional<Privilege> result = privilegeService.deleteById(1);

        assertTrue(result.isEmpty());
        verify(privilegeRepository, never()).deleteById(anyInt());
    }

    @Test
    @DisplayName("updateById")
    void updateById_success_updatesRoleName() {
        Privilege existing = new Privilege();
        existing.setPrivilegeId(1);
        existing.setRoleName("USER");

        Privilege updated = new Privilege();
        updated.setRoleName("ADMIN");

        when(privilegeRepository.findById(1))
            .thenReturn(Optional.of(existing));
        when(privilegeRepository.save(any()))
            .thenReturn(existing);

        Privilege result = privilegeService.updateById(1, updated);

        assertNotNull(result);
        assertEquals("ADMIN", result.getRoleName());
        verify(privilegeRepository).save(existing);
    }

    @Test
    void updateById_notFound_returnsNull() {
        when(privilegeRepository.findById(1))
            .thenReturn(Optional.empty());

        Privilege result =
            privilegeService.updateById(1, new Privilege());

        assertNull(result);
        verify(privilegeRepository, never()).save(any());
    }
}