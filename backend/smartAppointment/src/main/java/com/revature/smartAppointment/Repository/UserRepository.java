package com.revature.smartAppointment.Repository;

import java.util.List;
import java.util.Optional;

import com.revature.smartAppointment.Controller.Response.UserTableResponse;
import com.revature.smartAppointment.Model.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findUserByEmail(String email);

    List<User> findUsersByPrivilege_PrivilegeId(int privilegeId);

    @Query("""
        SELECT new com.revature.smartAppointment.Controller.Response.UserTableResponse(
            u.userId,
            u.firstName,
            u.lastName,
            u.email,
            p.roleName,
            s.specialityName,
            d.experienceYears,
            d.gender,
            d.bio
        )
        FROM User u
        JOIN u.privilege p
        LEFT JOIN Doctor d ON d.user = u
        LEFT JOIN d.speciality s
        WHERE p.roleName IN ('Doctor', 'Admin', 'Super')
    """)
    List<UserTableResponse> findUsersForTable();
}
