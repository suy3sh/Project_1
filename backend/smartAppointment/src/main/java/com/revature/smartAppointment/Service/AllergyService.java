package com.revature.smartAppointment.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.revature.smartAppointment.Model.Allergy;
import com.revature.smartAppointment.Repository.AllergyRepository;

@Service
public class AllergyService implements ServiceInterface<Allergy> {
    private final AllergyRepository allergyRepository; 

    public AllergyService(AllergyRepository allergyRepository){
        this.allergyRepository = allergyRepository;
    }
    
    @Override
    public Allergy save(Allergy entity){
        return allergyRepository.save(entity);
    }

    @Override
    public Optional<Allergy> findById(int id){
        return allergyRepository.findById(id);
    }

    @Override
    public List<Allergy> findAll(){
        return allergyRepository.findAll();
    }

    @Override
    public Optional<Allergy> deleteById(int id){
        //delete not needed for allergies
        return Optional.empty();
    }

    @Override
    public Allergy updateById(int id, Allergy entity){
        //update not needed for allergies
        return null;
    }

    public Optional<Allergy> findAllergyByName(String name){
        return allergyRepository.findAllergyByName(name);
    }
}
