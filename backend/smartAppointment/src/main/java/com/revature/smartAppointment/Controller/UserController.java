package com.revature.smartAppointment.Controller;

import com.revature.smartAppointment.Model.User;

import com.revature.smartAppointment.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class UserController {

    private UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/user/{user_id}")
    public @ResponseBody ResponseEntity<User> getUser(@PathVariable int user_id) {
        Optional<User> optionalUser = userService.findById(user_id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.status(200).body(optionalUser.get());
        }
        return ResponseEntity.status(400).build();

    }

    @RequestMapping("/register/{email}")
    public @ResponseBody ResponseEntity<User> getUser(@PathVariable String email) {
        Optional<User> optionalUser = userService.findUserByEmail(email);
        if (optionalUser.isPresent()) {
            return ResponseEntity.status(200).body(optionalUser.get());
        }
        return ResponseEntity.status(400).build();

    }

}
