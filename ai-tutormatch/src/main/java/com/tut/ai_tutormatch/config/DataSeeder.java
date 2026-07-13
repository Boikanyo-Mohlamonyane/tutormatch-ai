package com.tut.ai_tutormatch.config;

import com.tut.ai_tutormatch.enums.AdminPosition;
import com.tut.ai_tutormatch.enums.Department;
import com.tut.ai_tutormatch.enums.Role;

import com.tut.ai_tutormatch.model.Admin;
import com.tut.ai_tutormatch.model.User;

import com.tut.ai_tutormatch.repository.AdminRepository;
import com.tut.ai_tutormatch.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final AdminRepository adminRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepo,
            AdminRepository adminRepo,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        String adminEmail = "test@gmail.com";

        Optional<User> existingAdmin =
                userRepo.findByEmail(adminEmail);

        // =========================
        // CREATE DEFAULT ADMIN
        // =========================
        if (existingAdmin.isEmpty()) {

            // CREATE LOGIN ACCOUNT
            User user = new User();

            user.setEmail(adminEmail);

            user.setPassword(
                    passwordEncoder.encode("12345")
            );

            user.setRole(Role.ADMIN);

            userRepo.save(user);

            // CREATE ADMIN PROFILE
            Admin admin = new Admin();

            admin.setName("System");
            admin.setSurname("Admin");
            admin.setDepartment(Department.ADMINISTRATION);
            admin.setPhoneNumber("082 667 4431");
            admin.setOfficeLocation("16G24");
            admin.setPosition(AdminPosition.SYSTEM_ADMINISTRATOR);


            // LINK USER
            admin.setUser(user);

            adminRepo.save(admin);

            System.out.println(
                    "Default admin created: "
                            + adminEmail
            );

        } else {

            System.out.println(
                    "Admin already exists"
            );
        }
    }
}