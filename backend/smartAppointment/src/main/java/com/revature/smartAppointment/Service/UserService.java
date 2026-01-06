package com.revature.smartAppointment.Service;

import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(int id) {
        return userRepository.findUserByUserId(id);
    }
}
