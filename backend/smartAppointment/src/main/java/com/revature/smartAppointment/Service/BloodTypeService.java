package com.revature.smartAppointment.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.smartAppointment.Model.BloodType;
import com.revature.smartAppointment.Repository.BloodTypeRepository;

@Service
public class BloodTypeService implements ServiceInterface<BloodType>{
    private final BloodTypeRepository bloodTypeRepository;
    
    @Autowired
    public BloodTypeService(BloodTypeRepository bloodTypeRepository){
        this.bloodTypeRepository = bloodTypeRepository;
    }

    public BloodType save(BloodType entity){
        return null;
    }
    public Optional<BloodType> findById(int id){
        return bloodTypeRepository.findById(id);
    }
    public List<BloodType> findAll(){
        return bloodTypeRepository.findAll();
    }
    public Optional<BloodType> deleteById(int id){
        return Optional.empty();
    }
    public BloodType updateById(int id, BloodType entity){
        return null;
    }

    public Optional<BloodType> findBloodTypeByName(String name){
        return bloodTypeRepository.findBloodTypeByName(name);
    }
}
