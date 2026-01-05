package com.revature.smartAppointment.Repository;

import com.revature.smartAppointment.Model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    public User findUserByUserId(int id);
}
