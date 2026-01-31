package com.revature.smartAppointment.ControllerTest;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.revature.smartAppointment.Controller.UserController;
import com.revature.smartAppointment.Model.User;
import com.revature.smartAppointment.Controller.Response.UserTableResponse;
import com.revature.smartAppointment.Service.UserService;
import com.revature.smartAppointment.Util.JwtUtil;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtil jwtUtil;

    // ----------------------
    // GET /users
    // ----------------------

    @Test
    void getUsers_returnsListOfUsers() throws Exception {
        User user = new User();
        user.setUserId(1);
        user.setFirstName("John");
        user.setLastName("Doe");

        when(userService.findAll()).thenReturn(List.of(user));

        mockMvc.perform(get("/smart-appointment/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].firstName").value("John"));
    }

    @Test
    void getUser_found_returns200() throws Exception {
        User user = new User();
        user.setUserId(1);
        user.setFirstName("Jane");

        when(userService.findById(1)).thenReturn(Optional.of(user));

        mockMvc.perform(get("/smart-appointment/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Jane"));
    }

    @Test
    void getUser_notFound_returns404() throws Exception {
        when(userService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/smart-appointment/api/users/99"))
            .andExpect(status().isNotFound());
    }

    // ----------------------
    // GET /users/table
    // ----------------------

    @Test
    void getUsersForTable_superPrivilege_returns200() throws Exception {
        String token = "token";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.extractPrivilege(token)).thenReturn("Super");
        when(userService.getUsersForTable())
            .thenReturn(List.of(new UserTableResponse()));

        mockMvc.perform(get("/smart-appointment/api/users/table")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
    }

    @Test
    void getUsersForTable_invalidToken_returns401() throws Exception {
        String token = "token";

        when(jwtUtil.validateToken(token)).thenReturn(false);

        mockMvc.perform(get("/smart-appointment/api/users/table")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getUsersForTable_nonSuperPrivilege_returns403() throws Exception {
        String token = "token";

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.extractPrivilege(token)).thenReturn("Patient");

        mockMvc.perform(get("/smart-appointment/api/users/table")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isForbidden());
    }

    // ----------------------
    // PATCH /users/{id}
    // ----------------------

    @Test
    void updateUser_existing_returns200() throws Exception {
        User existing = new User();
        existing.setUserId(1);

        User updated = new User();
        updated.setUserId(1);
        updated.setFirstName("Updated");

        when(userService.findById(1)).thenReturn(Optional.of(existing));
        when(userService.updateById(eq(1), any(User.class)))
            .thenReturn(updated);

        mockMvc.perform(patch("/smart-appointment/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"Updated\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Updated"));
    }

    @Test
    void updateUser_notFound_returns404() throws Exception {
        when(userService.findById(1)).thenReturn(Optional.empty());

        mockMvc.perform(patch("/smart-appointment/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"Updated\"}"))
            .andExpect(status().isNotFound());
    }

    // ----------------------
    // DELETE /users/{id}
    // ----------------------

    @Test
    void deleteUser_found_returns200() throws Exception {
        when(userService.deleteById(1)).thenReturn(Optional.of(new User()));

        mockMvc.perform(delete("/smart-appointment/api/users/1"))
            .andExpect(status().isOk());
    }

    @Test
    void deleteUser_notFound_returns404() throws Exception {
        when(userService.deleteById(1)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/smart-appointment/api/users/1"))
            .andExpect(status().isNotFound());
    }
}
