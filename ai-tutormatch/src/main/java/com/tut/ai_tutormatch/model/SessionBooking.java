package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "session_bookings")
public class SessionBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private LocalDateTime bookingDate;

    private LocalDateTime sessionDate;

    private String status;

    @PrePersist
    public void onCreate() {
        this.bookingDate = LocalDateTime.now();
    }
}