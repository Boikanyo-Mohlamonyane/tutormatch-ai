package com.tut.ai_tutormatch.service.auth;

import com.tut.ai_tutormatch.config.PasswordConfig;
import com.tut.ai_tutormatch.dto.AuthRequest;
import com.tut.ai_tutormatch.dto.LoginRequest;
import com.tut.ai_tutormatch.dto.LoginResponse;
import com.tut.ai_tutormatch.enums.Role;
import com.tut.ai_tutormatch.model.Admin;
import com.tut.ai_tutormatch.model.Student;
import com.tut.ai_tutormatch.model.Tutor;
import com.tut.ai_tutormatch.model.User;
import com.tut.ai_tutormatch.repository.AdminRepository;
import com.tut.ai_tutormatch.repository.StudentRepository;
import com.tut.ai_tutormatch.repository.TutorRepository;
import com.tut.ai_tutormatch.repository.UserRepository;
import com.tut.ai_tutormatch.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordConfig passwordConfig;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private TutorRepository tutorRepo;

    public String register(AuthRequest auth) {

        Optional<User> existingUser =
                userRepo.findByEmail(auth.getEmail());

        if (existingUser.isPresent()) {
            return "Error: Email already exists!";
        }

        User user = new User();

        user.setEmail(auth.getEmail());

        user.setPassword(
                passwordConfig
                        .passwordEncoder()
                        .encode(auth.getPassword())
        );

        user.setRole(Role.STUDENT);


        userRepo.save(user);


        Student student = new Student();



        student.setName(
                auth.getName()
        );

        student.setSurname(
                auth.getSurname()
        );

        // USE VALUES FROM REQUEST
        student.setLearningStyle(
                auth.getLearningStyle()
        );

        student.setAcademicAverage(
                auth.getAcademicAverage()
        );

        student.setRiskLevel(
                auth.getRiskLevel()
        );

        // LINK USER ACCOUNT
        student.setUser(user);

        // SAVE STUDENT
        studentRepo.save(student);
        student.setStudentNumber(
                "STU" + String.format("%04d", student.getStudentId())
        );

        studentRepo.save(student);
        return "Successfully registered student: "
                + user.getEmail();
    }
    public LoginResponse login(LoginRequest auth) {

        User user = userRepo.findByEmail(auth.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordConfig.passwordEncoder().matches(
                auth.getPassword(),
                user.getPassword())) {

            return new LoginResponse(
                    null,
                    null,
                    null,
                    "Invalid password"
            );
        }

        Long studentId = studentRepo.findByUserUserId(user.getUserId())
                .map(Student::getStudentId)
                .orElse(null);

        Long tutorId = tutorRepo.findByUserUserId(user.getUserId())
                .map(Tutor::getTutorId)
                .orElse(null);

        Long adminId = adminRepo.findByUserUserId(user.getUserId())
                .map(Admin::getAdminId)
                .orElse(null);

        String token = JwtUtil.generateToken(
                user.getUserId(),
                studentId,
                tutorId,
                adminId,
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                user.getUserId(),
                token,
                user.getRole().name(),
                "Login successful"
        );
    }}