package com.revature.smartAppointment.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.smartAppointment.Controller.Response.UserTableResponse;
import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Service.UserService;
import com.revature.smartAppointment.Util.JwtUtil;

@RestController
@RequestMapping("/smart-appointment/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private UserService userService;
    private JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUser(@PathVariable int user_id) {
        Optional<User> optionalUser = userService.findById(user_id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.status(200).body(optionalUser.get());
        }
        return ResponseEntity.status(404).build();
    }

    @GetMapping("/table")
    public ResponseEntity<?> getUsersForTable(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).build();  
        }

        String privilege = jwtUtil.extractPrivilege(token);
        if (privilege.equals("Super")) {
            return ResponseEntity.ok(userService.getUsersForTable());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();  
        }
    }

    @PatchMapping("/{user_id}")
    public ResponseEntity<User> updateUser(@PathVariable int user_id, @RequestBody User userInfo) {
        Optional<User> optionalUser = userService.findById(user_id);
        if (optionalUser.isPresent()) {
            User updatedUser = userService.updateById(user_id, userInfo);
            return ResponseEntity.status(200).body(updatedUser);
        }
        return ResponseEntity.status(404).build();
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int user_id) {
        Optional<User> optionalUser = userService.deleteById(user_id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(404).build();
    }
}
