package com.revature.smartAppointment.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AvailabilityWindowDTO {
    private int windowId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean active;
    private int doctorId;
    private String doctorName; // optional

    public AvailabilityWindowDTO() {}

    public AvailabilityWindowDTO(int windowId, LocalDate date, LocalTime startTime, LocalTime endTime, boolean active, int doctorId, String doctorName) {
        this.windowId = windowId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.active = active;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
    }

    public int getWindowId() { return windowId; }
    public LocalDate getDate() { return date; }
    public LocalTime getStartTime() { return startTime; }
    public LocalTime getEndTime() { return endTime; }
    public boolean isActive() { return active; }
    public int getDoctorId() { return doctorId; }
    public String getDoctorName() { return doctorName; }

    public void setWindowId(int windowId) { this.windowId = windowId; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public void setActive(boolean active) { this.active = active; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
// DTO (Data Transfer Object) used to send only the fields the frontend needs
// This avoids lazy-loading errors and prevents exposing full Hibernate entities