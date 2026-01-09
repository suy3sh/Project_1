package com.revature.smartAppointment.Controller;

import com.revature.smartAppointment.Model.User;

import com.revature.smartAppointment.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/users/{user_id}", method = RequestMethod.GET)
    public @ResponseBody ResponseEntity<User> getUser(@PathVariable int user_id) {
        Optional<User> optionalUser = userService.findById(user_id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.status(200).body(optionalUser.get());
        }
        return ResponseEntity.status(400).build();

    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public @ResponseBody ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    //Will work on proper login and registration, and move it to the correct locations
    //Temporary working solution
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<User> userLogin(@RequestBody User user) {
        Optional<User> optionalUser = userService.findUserByEmail(user.getEmail());
        if (optionalUser.isPresent()) {
            User presentUser = optionalUser.get();
            if (user.getPassword().equals(presentUser.getPassword())) {
                return ResponseEntity.ok(presentUser);
            }
        }
        throw new RuntimeException("Incorrect username or password");
    }
}
