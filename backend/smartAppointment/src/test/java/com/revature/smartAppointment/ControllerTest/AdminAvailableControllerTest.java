package com.revature.smartAppointment.ControllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.revature.smartAppointment.Controller.AdminAvailabilityController;
import com.revature.smartAppointment.Model.AvailabilityWindow;
import com.revature.smartAppointment.Service.AvailabilityWindowService;
import com.revature.smartAppointment.Service.UserService;
import com.revature.smartAppointment.Util.JwtUtil;
import com.revature.smartAppointment.dto.AvailabilityWindowDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminAvailabilityController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminAvailabilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @MockitoBean
    private AvailabilityWindowService availabilityWindowService;

        @MockitoBean
        private JwtUtil jwtUtil;

        @MockitoBean
        private UserService userService;

    public AdminAvailabilityControllerTest(){
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    // =====================
    // GET /{doctorId}/availability-windows
    // =====================
    @Test
        void getAvailabilityWindows_returnsDTOList() throws Exception {
        AvailabilityWindowDTO dto = new AvailabilityWindowDTO();
        dto.setWindowId(1);
        dto.setDoctorId(10);
        dto.setActive(true);

        when(availabilityWindowService.getWindowsForDoctor(10))
                .thenReturn(List.of(dto));

        when(jwtUtil.validateToken(anyString())).thenReturn(true);
        when(jwtUtil.extractPrivilege(anyString())).thenReturn("Admin");

        mockMvc.perform(get("/smart-appointment/api/admin/doctors/10/availability-windows")
                .header("Authorization", "Bearer faketoken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].windowId").value(1))
                .andExpect(jsonPath("$[0].doctorId").value(10))
                .andExpect(jsonPath("$[0].active").value(true));

        verify(availabilityWindowService).getWindowsForDoctor(10);
        }


    // =====================
    // POST /{doctorId}/availability-windows
    // =====================
    @Test
void createAvailabilityWindow_callsService() throws Exception {
        AdminAvailabilityController.AvailabilityWindowRequest request =
                new AdminAvailabilityController.AvailabilityWindowRequest();
        request.setDate(LocalDate.of(2026, 1, 25));
        request.setStartTime(LocalTime.of(9, 0));
        request.setEndTime(LocalTime.of(10, 0));

        // Mock JWT
        when(jwtUtil.validateToken(anyString())).thenReturn(true);
        when(jwtUtil.extractPrivilege(anyString())).thenReturn("Admin");

        // Mock service return
        AvailabilityWindow window = mock(AvailabilityWindow.class);
        when(window.getWindowId()).thenReturn(1);
        when(window.getDate()).thenReturn(request.getDate());
        when(window.getStartTime()).thenReturn(request.getStartTime());
        when(window.getEndTime()).thenReturn(request.getEndTime());
        when(window.isActive()).thenReturn(true);
        // Mock doctor inside window
        var doctor = mock(com.revature.smartAppointment.Model.Doctor.class);
        when(window.getDoctor()).thenReturn(doctor);
        var user = mock(com.revature.smartAppointment.Model.User.class);
        when(doctor.getUser()).thenReturn(user);
        when(user.getFirstName()).thenReturn("John");
        when(user.getLastName()).thenReturn("Doe");
        when(doctor.getDoctorId()).thenReturn(5);

        when(availabilityWindowService.createWindow(
                eq(5),
                eq(request.getDate()),
                eq(request.getStartTime()),
                eq(request.getEndTime())
        )).thenReturn(window);

        mockMvc.perform(post("/smart-appointment/api/admin/doctors/5/availability-windows")
                        .header("Authorization", "Bearer faketoken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        verify(availabilityWindowService)
                .createWindow(5, request.getDate(), request.getStartTime(), request.getEndTime());
        }

}

