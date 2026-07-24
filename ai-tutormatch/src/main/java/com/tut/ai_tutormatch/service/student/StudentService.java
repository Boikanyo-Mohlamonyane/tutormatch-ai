package com.tut.ai_tutormatch.service.student;

import com.tut.ai_tutormatch.dto.BookingResponse;
import com.tut.ai_tutormatch.dto.TutorSubjectResponse;
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

    public List<TutorSubjectResponse> getTutorsBySubject(Long subjectId) {

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        return tutorSubjectRepo.findBySubject(subject)
                .stream()
                .map(ts -> new TutorSubjectResponse(
                        ts.getTutor().getTutorId(),
                        ts.getTutor().getName() + " " + ts.getTutor().getSurname(),
                        ts.getTutor().getSpecialization().name(),
                        ts.getTutor().getYearsExperience(),
                        ts.getSubject().getSubjectId(),
                        ts.getSubject().getSubjectName()
                ))
                .toList();
    }
    @Transactional
    public String bookSession(
            Long studentId,
            Long tutorId,
            Long subjectId,
            LocalDateTime sessionDate
    ) {

        // Validate request
        if (studentId == null) {
            throw new RuntimeException("Student ID cannot be null");
        }

        if (tutorId == null) {
            throw new RuntimeException("Tutor ID cannot be null");
        }

        if (subjectId == null) {
            throw new RuntimeException("Subject ID cannot be null");
        }

        if (sessionDate == null) {
            throw new RuntimeException("Session date is required");
        }

        Student student = studentRepo.findByUserUserId(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        if (sessionDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Session date cannot be in the past");
        }

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

    public List<BookingResponse> getStudentBookings(Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return bookingRepo.findByStudent(student)
                .stream()
                .map(booking -> new BookingResponse(

                        booking.getBookingId(),

                        booking.getTutor().getTutorId(),
                        booking.getTutor().getName() + " " +
                                booking.getTutor().getSurname(),

                        booking.getSubject().getSubjectId(),
                        booking.getSubject().getSubjectName(),

                        booking.getSessionDate(),

                        booking.getStatus()
                ))
                .toList();
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

