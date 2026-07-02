package com.tut.ai_tutormatch.service.tutor;

import com.tut.ai_tutormatch.model.*;

import com.tut.ai_tutormatch.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepo;

    @Autowired
    private TutorSubjectRepository tutorSubjectRepo;

    @Autowired
    private SessionBookingRepository bookingRepo;

    @Autowired
    private StudentPerformanceRepository performanceRepo;

    // =====================================================
    // GET TUTOR BY ID
    // =====================================================
    public Tutor getTutor(Long tutorId) {

        return tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));
    }

    // =====================================================
    // GET TUTOR SUBJECTS
    // =====================================================
    public List<TutorSubject> getTutorSubjects(Long tutorId) {

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        return tutorSubjectRepo.findByTutor(tutor);
    }

    // =====================================================
    // GET TUTOR BOOKINGS
    // =====================================================
    public List<SessionBooking> getTutorBookings(Long tutorId) {

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        return bookingRepo.findByTutor(tutor);
    }

    // =====================================================
    // APPROVE BOOKING
    // =====================================================
    public String approveBooking(Long bookingId) {

        SessionBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("APPROVED");

        bookingRepo.save(booking);

        return "Booking approved successfully";
    }

    // =====================================================
    // REJECT BOOKING
    // =====================================================
    public String rejectBooking(Long bookingId) {

        SessionBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");

        bookingRepo.save(booking);

        return "Booking rejected successfully";
    }

    // =====================================================
    // UPDATE TUTOR PROFILE
    // =====================================================
    public String updateTutorProfile(
            Long tutorId,
            Tutor updatedTutor
    ) {

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        tutor.setName(updatedTutor.getName());

        tutor.setSurname(updatedTutor.getSurname());

        tutor.setSpecialization(
                updatedTutor.getSpecialization()
        );

        tutor.setYearsExperience(
                updatedTutor.getYearsExperience()
        );

        tutorRepo.save(tutor);

        return "Tutor profile updated successfully";
    }

    // =====================================================
    // VIEW STUDENT PERFORMANCE
    // =====================================================
    public List<StudentPerformance> getStudentPerformance() {

        return performanceRepo.findAll();
    }

    // =====================================================
    // TUTOR DASHBOARD
    // =====================================================
    public String getTutorDashboard(Long tutorId) {

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        long totalSubjects =
                tutorSubjectRepo.findByTutor(tutor).size();

        long totalBookings =
                bookingRepo.findByTutor(tutor).size();

        return
                "Tutor: " + tutor.getName() +
                        "\nSpecialization: " +
                        tutor.getSpecialization() +
                        "\nYears Experience: " +
                        tutor.getYearsExperience() +
                        "\nAssigned Subjects: " +
                        totalSubjects +
                        "\nTotal Bookings: " +
                        totalBookings;
    }
}

