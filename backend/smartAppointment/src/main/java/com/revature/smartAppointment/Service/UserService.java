package com.revature.smartAppointment.Service;

import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Repository.PrivilegeRepository;
import com.revature.smartAppointment.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements ServiceInterface<User> {
    private UserRepository userRepository;
    private PrivilegeRepository privilegeRepository;

    @Autowired
    public UserService(UserRepository userRepository, PrivilegeRepository privilegeRepository) {
        this.userRepository = userRepository;
        this.privilegeRepository = privilegeRepository;
    }

    @Override
    public User save(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public Optional<User> findById(int id) {
        return userRepository.findById(id);
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> deleteById(int id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            userRepository.deleteById(id);
        }
        return optionalUser;
    }

    @Override
    public User updateById(int id, User newUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEmail(newUser.getEmail());
            user.setPassword(newUser.getPassword());
            user.setFirstName(newUser.getFirstName());
            user.setLastName(newUser.getLastName());
            user.setPrivilege(newUser.getPrivilege());
            return userRepository.save(user);
        }
        return null;
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }
}
