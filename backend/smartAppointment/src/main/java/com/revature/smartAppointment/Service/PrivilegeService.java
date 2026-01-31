package com.revature.smartAppointment.Service;

import com.revature.smartAppointment.Model.Privilege;
import com.revature.smartAppointment.Repository.PrivilegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrivilegeService implements ServiceInterface<Privilege> {
    private PrivilegeRepository privilegeRepository;

    @Autowired
    public PrivilegeService(PrivilegeRepository privilegeRepository) {
        this.privilegeRepository = privilegeRepository;
    }

    @Override
    public Privilege save(Privilege entity) {
        return privilegeRepository.save(entity);
    }

    @Override
    public Optional<Privilege> findById(int id) {
        return privilegeRepository.findById(id);
    }

    @Override
    public List<Privilege> findAll() {
        return privilegeRepository.findAll();
    }

    @Override
    public Optional<Privilege> deleteById(int id) {
        Optional<Privilege> optionalPrivilege = privilegeRepository.findById(id);
        if (optionalPrivilege.isPresent()) {
            privilegeRepository.deleteById(id);
        }
        return optionalPrivilege;
    }

    @Override
    public Privilege updateById(int id, Privilege newPrivilege) {
        Optional<Privilege> optionalPrivilege = privilegeRepository.findById(id);
        if (optionalPrivilege.isPresent()) {
            Privilege privilege = optionalPrivilege.get();
            privilege.setRoleName(newPrivilege.getRoleName());
            return privilegeRepository.save(privilege);
        }
        return null;
    }
}
