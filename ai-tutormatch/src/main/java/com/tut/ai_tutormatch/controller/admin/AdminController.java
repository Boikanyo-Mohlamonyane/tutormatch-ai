package com.tut.ai_tutormatch.controller.admin;

import com.tut.ai_tutormatch.dto.*;
import com.tut.ai_tutormatch.model.*;
import com.tut.ai_tutormatch.service.admin.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // =========================================
    // CREATE SUBJECT
    // =========================================

    @PostMapping("/create/subject")
    public String createSubject(
            @RequestBody CreateSubjectRequest request
    ) {

        return adminService.createSubject(request);
    }

    // =========================================
    // UPDATE SUBJECT
    // =========================================

    @PutMapping("/update-subject/{subjectId}")
    public String updateSubject(
            @PathVariable Long subjectId,
            @RequestBody CreateSubjectRequest request
    ) {

        return adminService.updateSubject(
                subjectId,
                request
        );
    }

    // =========================================
    // DELETE SUBJECT
    // =========================================

    @DeleteMapping("/delete-subject/{subjectId}")
    public String deleteSubject(
            @PathVariable Long subjectId
    ) {

        return adminService.deleteSubject(subjectId);
    }

    // =========================================
    // ASSIGN SUBJECT TO TUTOR
    // =========================================

    @PostMapping("/assign-tutor-subject")
    public String assignSubjectToTutor(
            @RequestBody AssignTutorSubjectRequest request
    ) {

        return adminService
                .assignSubjectToTutor(request);
    }

    // =========================================
    // CREATE ADMIN
    // =========================================

    @PostMapping("/create-admin")
    public String createAdmin(
            @RequestBody CreateAdminRequest request
    ) {

        return adminService.createAdmin(request);
    }

    // =========================================
    // DASHBOARD
    // =========================================

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return adminService.getDashboardStats();
    }

    // =========================================
    // CREATE TUTOR
    // =========================================

    @PostMapping("/create-tutor")
    public String createTutor(
            @RequestBody CreateTutorRequest request
    ) {

        return adminService.createTutor(request);
    }

    // =========================================
    // GET ALL STUDENTS
    // =========================================

    @GetMapping("/students")
    public List<Student> getAllStudents() {

        return adminService.getAllStudents();
    }

    // =========================================
    // GET ALL TUTORS
    // =========================================

    @GetMapping("/tutors")
    public List<Tutor> getAllTutors() {

        return adminService.getAllTutors();
    }
    @GetMapping("/subjects")
   public List<Subject> getAllSubjects(){
        return  adminService.getAllSubjects();
   }
    // =========================================
    // GET ALL BOOKINGS
    // =========================================

    @GetMapping("/bookings")
    public List<SessionBooking> getAllBookings() {

        return adminService.getAllBookings();
    }

    // =========================================
    // DELETE STUDENT
    // =========================================

    @DeleteMapping("/delete-student/{studentId}")
    public String deleteStudent(
            @PathVariable Long studentId
    ) {

        return adminService.deleteStudent(studentId);
    }

    // =========================================
    // DELETE TUTOR
    // =========================================

    @DeleteMapping("/delete-tutor/{tutorId}")
    public String deleteTutor(
            @PathVariable Long tutorId
    ) {

        return adminService.deleteTutor(tutorId);
    }

    // =========================================
    // APPROVE BOOKING
    // =========================================

    @PutMapping("/approve-booking/{bookingId}")
    public String approveBooking(
            @PathVariable Long bookingId
    ) {

        return adminService.approveBooking(bookingId);
    }

    // =========================================
    // REJECT BOOKING
    // =========================================

    @PutMapping("/reject-booking/{bookingId}")
    public String rejectBooking(
            @PathVariable Long bookingId
    ) {

        return adminService.rejectBooking(bookingId);
    }
}