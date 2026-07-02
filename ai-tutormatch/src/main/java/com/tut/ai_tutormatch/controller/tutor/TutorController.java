package com.tut.ai_tutormatch.controller.tutor;

import com.tut.ai_tutormatch.model.SessionBooking;
import com.tut.ai_tutormatch.model.StudentPerformance;
import com.tut.ai_tutormatch.model.Tutor;
import com.tut.ai_tutormatch.model.TutorSubject;
import com.tut.ai_tutormatch.service.tutor.TutorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutor")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    // =====================================================
    // GET TUTOR BY ID
    // =====================================================

    @GetMapping("/{tutorId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<Tutor> getTutor(
            @PathVariable Long tutorId
    ) {

        return ResponseEntity.ok(
                tutorService.getTutor(tutorId)
        );
    }

    // =====================================================
    // GET TUTOR SUBJECTS
    // =====================================================

    @GetMapping("/{tutorId}/subjects")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<List<TutorSubject>> getTutorSubjects(
            @PathVariable Long tutorId
    ) {

        return ResponseEntity.ok(
                tutorService.getTutorSubjects(tutorId)
        );
    }

    // =====================================================
    // GET TUTOR BOOKINGS
    // =====================================================

    @GetMapping("/{tutorId}/bookings")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<List<SessionBooking>> getTutorBookings(
            @PathVariable Long tutorId
    ) {

        return ResponseEntity.ok(
                tutorService.getTutorBookings(tutorId)
        );
    }

    // =====================================================
    // APPROVE BOOKING
    // =====================================================

    @PutMapping("/approve-booking/{bookingId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<String> approveBooking(
            @PathVariable Long bookingId
    ) {

        return ResponseEntity.ok(
                tutorService.approveBooking(bookingId)
        );
    }

    // =====================================================
    // REJECT BOOKING
    // =====================================================

    @PutMapping("/reject-booking/{bookingId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<String> rejectBooking(
            @PathVariable Long bookingId
    ) {

        return ResponseEntity.ok(
                tutorService.rejectBooking(bookingId)
        );
    }

    // =====================================================
    // UPDATE TUTOR PROFILE
    // =====================================================

    @PutMapping("/update-profile/{tutorId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<String> updateTutorProfile(
            @PathVariable Long tutorId,
            @RequestBody Tutor updatedTutor
    ) {

        return ResponseEntity.ok(
                tutorService.updateTutorProfile(
                        tutorId,
                        updatedTutor
                )
        );
    }

    // =====================================================
    // VIEW STUDENT PERFORMANCE
    // =====================================================

    @GetMapping("/student-performance")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<List<StudentPerformance>>
    getStudentPerformance() {

        return ResponseEntity.ok(
                tutorService.getStudentPerformance()
        );
    }

    // =====================================================
    // TUTOR DASHBOARD
    // =====================================================

    @GetMapping("/dashboard/{tutorId}")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<String> getTutorDashboard(
            @PathVariable Long tutorId
    ) {

        return ResponseEntity.ok(
                tutorService.getTutorDashboard(tutorId)
        );
    }
}