package com.revature.smartAppointment.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.smartAppointment.Model.Speciality;
import com.revature.smartAppointment.Repository.SpecialityRepository;

@Service
public class SpecialityService implements ServiceInterface<Speciality> {
    private SpecialityRepository specialityRepository;

    @Autowired
    public SpecialityService(SpecialityRepository specialityRepository) {
        this.specialityRepository = specialityRepository;
    }

    @Override
    public Speciality save(Speciality entity) {
        return specialityRepository.save(entity);
    }

    @Override
    public Optional<Speciality> findById(int id) {
        return specialityRepository.findById(id);
    }

    @Override
    public List<Speciality> findAll() {
        return specialityRepository.findAll();
    }

    @Override
    public Optional<Speciality> deleteById(int id) {
        return Optional.empty();
    }

    @Override
    public Speciality updateById(int id, Speciality entity) {
        return null;
    }

    public Optional<Speciality> findSpecialityBySpecialityName(String name) {
        return specialityRepository.findSpecialityBySpecialityName(name);
    }
    
}
