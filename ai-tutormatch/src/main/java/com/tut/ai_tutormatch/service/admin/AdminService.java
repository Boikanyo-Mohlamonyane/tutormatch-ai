package com.tut.ai_tutormatch.service.admin;

import com.tut.ai_tutormatch.dto.*;
import com.tut.ai_tutormatch.enums.Role;

import com.tut.ai_tutormatch.model.*;

import com.tut.ai_tutormatch.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private SubjectRepository subjectRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private TutorSubjectRepository tutorSubjectRepo;
    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private TutorRepository tutorRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private SessionBookingRepository bookingRepo;
    // =========================================
    // CREATE ADMIN
    // =========================================



    public String createAdmin(CreateAdminRequest request) {

        // CHECK IF EMAIL EXISTS
        Optional<User> existingUser =
                userRepo.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return "Error: Email already exists!";
        }

        // CREATE LOGIN ACCOUNT
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ADMIN);

        userRepo.save(user);

        // GENERATE EMPLOYEE NUMBER
        long nextNumber = adminRepo.count() + 1;
        String employeeNumber = String.format("ADM%04d", nextNumber);

        // CREATE ADMIN PROFILE
        Admin admin = new Admin();


        admin.setEmployeeNumber(employeeNumber);
        admin.setName(request.getName());
        admin.setSurname(request.getSurname());
        admin.setDepartment(request.getDepartment());
        admin.setPhoneNumber(request.getPhoneNumber());
        admin.setOfficeLocation(request.getOfficeLocation());
        admin.setPosition(request.getPosition());

        // LINK USER
        admin.setUser(user);

        // SAVE ADMIN
        adminRepo.save(admin);

        return "Admin created successfully";
    }
    public AdminDashboardResponse getDashboardStats() {

        Long totalStudents = studentRepo.count();

        Long totalTutors = tutorRepo.count();

        Long totalSubjects = subjectRepo.count();

        Long totalBookings = bookingRepo.count();

        Long totalAdmins = adminRepo.count();

        Long highRiskStudents =
                studentRepo.countByRiskLevel("HIGH");

        Double averagePerformance =
                studentRepo.getAverageAcademicPerformance();

        if (averagePerformance == null) {
            averagePerformance = 0.0;
        }

        return new AdminDashboardResponse(
                totalStudents,
                totalTutors,
                totalSubjects,
                totalBookings,
                totalAdmins,
                averagePerformance,
                highRiskStudents
        );
    }
    // =========================================
    // CREATE TUTOR
    // =========================================
    public String createTutor(CreateTutorRequest request) {
        long count = tutorRepo.count() + 1;
        String employeeNumber = String.format("TUT%04d", count);
        // CHECK IF EMAIL EXISTS
        Optional<User> existingUser =
                userRepo.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return "Error: Email already exists!";
        }

        // CREATE LOGIN ACCOUNT
        User user = new User();
        user.setEmail(request.getEmail());

        // ENCRYPT PASSWORD
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        // SET ROLE
        user.setRole(Role.TUTOR);

        // SAVE USER
        userRepo.save(user);

        // CREATE TUTOR PROFILE
        Tutor tutor = new Tutor();

        tutor.setEmployeeNumber(
                employeeNumber
        );

        tutor.setName(request.getName());

        tutor.setSurname(request.getSurname());

        tutor.setBio(request.getBio());

        tutor.setSpecialization(
                request.getSpecialization()
        );

        tutor.setYearsExperience(
                request.getYearsExperience()
        );

        // LINK USER
        tutor.setUser(user);

        // SAVE TUTOR
        tutorRepo.save(tutor);

        return "Tutor created successfully";
    }

    public String assignSubjectToTutor(
            AssignTutorSubjectRequest request
    ) {

        // FIND TUTOR
        Tutor tutor = tutorRepo.findById(
                request.getTutorId()
        ).orElseThrow(() ->
                new RuntimeException("Tutor not found")
        );

        // FIND SUBJECT
        Subject subject = subjectRepo.findById(
                request.getSubjectId()
        ).orElseThrow(() ->
                new RuntimeException("Subject not found")
        );

        // CREATE RELATIONSHIP
        TutorSubject tutorSubject =
                new TutorSubject();

        tutorSubject.setTutor(tutor);

        tutorSubject.setSubject(subject);

        // SAVE
        tutorSubjectRepo.save(tutorSubject);

        return "Subject assigned to tutor successfully";
    }

    // GET ALL STUDENTS

    public List<StudentDto> getAllStudents() {
        return studentRepo.findAll()
                .stream()
                .map(student -> {
                    StudentDto dto = new StudentDto();
                    dto.setStudentId(student.getStudentId());
                    dto.setStudentNumber(student.getStudentNumber());
                    dto.setName(student.getName());
                    dto.setSurname(student.getSurname());
                    dto.setLearningStyle(student.getLearningStyle());
                    dto.setAcademicAverage(student.getAcademicAverage());
                    dto.setRiskLevel(student.getRiskLevel());
                    dto.setUserId(student.getUser().getUserId());
                    return dto;
                })
                .toList();
    }


    // GET ALL TUTORS
// =========================================
    public List<Tutor> getAllTutors() {

        return tutorRepo.findAll();
    }
public  List<Subject>getAllSubjects(){
        return  subjectRepo.findAll();
}
    // =========================================
// GET ALL BOOKINGS
// =========================================
    public List<SessionBooking> getAllBookings() {

        return bookingRepo.findAll();
    }

    // =========================================
// DELETE STUDENT
// =========================================
    public String deleteStudent(Long studentId) {

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        studentRepo.delete(student);

        return "Student deleted successfully";
    }

    // =========================================
// DELETE TUTOR
// =========================================
    public String deleteTutor(Long tutorId) {

        Tutor tutor = tutorRepo.findById(tutorId)
                .orElseThrow(() ->
                        new RuntimeException("Tutor not found"));

        tutorRepo.delete(tutor);

        return "Tutor deleted successfully";
    }

    // =========================================
// DELETE SUBJECT
// =========================================
    public String deleteSubject(Long subjectId) {

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        subjectRepo.delete(subject);

        return "Subject deleted successfully";
    }




    // =========================================
//  SUBJECTS
// =========================================

    public String createSubject(CreateSubjectRequest request) {

        Optional<Subject> existing =
                subjectRepo.findBySubjectCode(
                        request.getSubjectCode()
                );

        if (existing.isPresent()) {
            return "Subject already exists";
        }

        Subject subject = new Subject();

        subject.setSubjectCode(
                request.getSubjectCode()
        );

        subject.setSubjectName(
                request.getSubjectName()
        );

        subject.setDescription(
                request.getDescription()
        );

        subjectRepo.save(subject);

        return "Subject created successfully";
    }

    public String updateSubject(
            Long subjectId,
            CreateSubjectRequest request
    ) {

        Subject subject = subjectRepo.findById(subjectId)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        subject.setSubjectCode(request.getSubjectCode());

        subject.setSubjectName(request.getSubjectName());

        subject.setDescription(request.getDescription());

        subjectRepo.save(subject);

        return "Subject updated successfully";
    }

    // =========================================
// APPROVE BOOKING
// =========================================
    public String approveBooking(Long bookingId) {

        SessionBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("APPROVED");

        bookingRepo.save(booking);

        return "Booking approved successfully";
    }

    // =========================================
// REJECT BOOKING
// =========================================
    public String rejectBooking(Long bookingId) {

        SessionBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");

        bookingRepo.save(booking);

        return "Booking rejected successfully";
    }

}