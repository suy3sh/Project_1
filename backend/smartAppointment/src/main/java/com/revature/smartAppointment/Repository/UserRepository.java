package com.revature.smartAppointment.Repository;

import java.util.List;
import java.util.Optional;

import com.revature.smartAppointment.Model.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findUserByEmail(String email);
}
