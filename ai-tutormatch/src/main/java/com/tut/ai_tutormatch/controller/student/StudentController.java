package com.tut.ai_tutormatch.controller.student;

import com.tut.ai_tutormatch.dto.BookSessionRequest;
import com.tut.ai_tutormatch.dto.BookingResponse;
import com.tut.ai_tutormatch.dto.TutorSubjectResponse;
import com.tut.ai_tutormatch.model.*;
import com.tut.ai_tutormatch.service.student.StudentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // =====================================================
    // GET ALL SUBJECTS
    // =====================================================
    @GetMapping("/subjects")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Subject> getAllSubjects() {

        return studentService.getAllSubjects();
    }

    // =====================================================
    // GET STUDENT BY ID
    // =====================================================
    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public Student getStudent(
            @PathVariable Long studentId
    ) {

        return studentService.getStudent(studentId);
    }

    // =====================================================
    // GET TUTORS BY SUBJECT
    // =====================================================
    @GetMapping("/subject/{subjectId}/tutors")
    @PreAuthorize("hasRole('STUDENT')")
    public List<TutorSubjectResponse> getTutorsBySubject(
            @PathVariable Long subjectId
    ) {

        return studentService.getTutorsBySubject(subjectId);
    }

    // =====================================================
    // BOOK SESSION
    // =====================================================
    @PostMapping("/book-session")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> bookSession(
            @RequestBody BookSessionRequest request
    ) {

        String response = studentService.bookSession(
                request.getStudentId(),
                request.getTutorId(),
                request.getSubjectId(),
                request.getSessionDate()
        );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // GET STUDENT BOOKINGS
    // =====================================================
    @GetMapping("/{studentId}/bookings")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<BookingResponse>> getStudentBookings(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                studentService.getStudentBookings(studentId)
        );
    }

    // =====================================================
    // CANCEL BOOKING
    // =====================================================
    @PutMapping("/cancel-booking/{bookingId}")
    @PreAuthorize("hasRole('STUDENT')")
    public String cancelBooking(
            @PathVariable Long bookingId
    ) {

        return studentService.cancelBooking(bookingId);
    }

    // =====================================================
    // VIEW PERFORMANCE
    // =====================================================
    @GetMapping("/{studentId}/performance")
    @PreAuthorize("hasRole('STUDENT')")
    public List<StudentPerformance> getPerformance(
            @PathVariable Long studentId
    ) {

        return studentService
                .getStudentPerformance(studentId);
    }

    // =====================================================
    // CALCULATE RISK LEVEL
    // =====================================================
    @PutMapping("/{studentId}/risk")
    @PreAuthorize("hasRole('STUDENT')")
    public String calculateRiskLevel(
            @PathVariable Long studentId
    ) {

        return studentService
                .calculateRiskLevel(studentId);
    }

    // =====================================================
    // AI TUTOR RECOMMENDATION
    // =====================================================
    @GetMapping("/recommend-tutor/{subjectId}")
    @PreAuthorize("hasRole('STUDENT')")
    public Tutor recommendTutor(
            @PathVariable Long subjectId
    ) {

        return studentService
                .recommendTutor(subjectId);
    }

    // =====================================================
    // STUDENT DASHBOARD
    // =====================================================
    @GetMapping("/{studentId}/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public String studentDashboard(
            @PathVariable Long studentId
    ) {

        return studentService
                .getStudentDashboard(studentId);
    }
}
