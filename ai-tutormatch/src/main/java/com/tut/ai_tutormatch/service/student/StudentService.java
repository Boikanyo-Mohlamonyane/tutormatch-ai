package com.tut.ai_tutormatch.service.student;

import com.tut.ai_tutormatch.model.*;
import com.tut.ai_tutormatch.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private SubjectRepository subjectRepo;

    @Autowired
    private TutorRepository tutorRepo;

    @Autowired
    private TutorSubjectRepository tutorSubjectRepo;

    @Autowired
    private SessionBookingRepository bookingRepo;

    @Autowired
    private StudentPerformanceRepository performanceRepo;

    // =====================================================
    // GET ALL SUBJECTS
    // =====================================================
    public List<Subject> getAllSubjects() {
        return subjectRepo.findAll();
    }

    // =====================================================
    // GET STUDENT BY ID
    // =====================================================
    public Student getStudent(Long studentId) {

        return studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));
    }

    // =====================================================
    // GET TUTORS FOR SUBJECT
    // =====================================================
    public List<TutorSubject> getTutorsBySubject(Long subjectId) {

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        return tutorSubjectRepo.findBySubject(subject);
    }

    // =====================================================
    // BOOK TUTOR SESSION
    // =====================================================
    @Transactional
    public String bookSession(
            Long studentId,
            Long tutorId,
            Long subjectId,
            LocalDateTime sessionDate
    ) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        // Prevent booking in the past
        if (sessionDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Session date cannot be in the past");
        }

        // Optional: Prevent duplicate bookings
        boolean exists = bookingRepo.existsByTutorAndSessionDate(
                tutor,
                sessionDate
        );

        if (exists) {
            throw new RuntimeException("Tutor already booked for this time");
        }

        SessionBooking booking = new SessionBooking();

        booking.setStudent(student);
        booking.setTutor(tutor);
        booking.setSubject(subject);
        booking.setSessionDate(sessionDate);
        booking.setStatus("PENDING");

        bookingRepo.save(booking);

        return "Session booked successfully";
    }
    // =====================================================
    // VIEW STUDENT BOOKINGS
    // =====================================================
    public List<SessionBooking> getStudentBookings(Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        return bookingRepo.findByStudent(student);
    }

    // =====================================================
    // CANCEL BOOKING
    // =====================================================
    public String cancelBooking(Long bookingId) {

        SessionBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");

        bookingRepo.save(booking);

        return "Booking cancelled";
    }

    // =====================================================
    // VIEW PERFORMANCE
    // =====================================================
    public List<StudentPerformance> getStudentPerformance(Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        return performanceRepo.findByStudent(student);
    }

    // =====================================================
    // RISK DETECTION BUSINESS LOGIC
    // =====================================================
    public String calculateRiskLevel(Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Double avg = student.getAcademicAverage();

        String risk;

        if (avg < 50) {

            risk = "HIGH";

        } else if (avg < 70) {

            risk = "MEDIUM";

        } else {

            risk = "LOW";
        }

        student.setRiskLevel(risk);

        studentRepo.save(student);

        return "Student risk level updated to: " + risk;
    }

    // =====================================================
    // AI TUTOR RECOMMENDATION
    // =====================================================
    public Tutor recommendTutor(Long subjectId) {

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        List<TutorSubject> tutorSubjects =
                tutorSubjectRepo.findBySubject(subject);

        if (tutorSubjects.isEmpty()) {
            throw new RuntimeException(
                    "No tutors available for this subject"
            );
        }

        // SIMPLE AI LOGIC:
        // RETURN TUTOR WITH MOST EXPERIENCE

        Tutor bestTutor = tutorSubjects.get(0).getTutor();

        for (TutorSubject ts : tutorSubjects) {

            Tutor currentTutor = ts.getTutor();

            if (currentTutor.getYearsExperience() >
                    bestTutor.getYearsExperience()) {

                bestTutor = currentTutor;
            }
        }

        return bestTutor;
    }

    // =====================================================
    // STUDENT DASHBOARD SUMMARY
    // =====================================================
    public String getStudentDashboard(Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        long totalBookings =
                bookingRepo.findByStudent(student).size();

        long totalPerformances =
                performanceRepo.findByStudent(student).size();

        return
                "Student: " + student.getName() +
                        "\nRisk Level: " + student.getRiskLevel() +
                        "\nAcademic Average: " +
                        student.getAcademicAverage() +
                        "\nTotal Bookings: " + totalBookings +
                        "\nPerformance Records: " + totalPerformances;
    }
}

