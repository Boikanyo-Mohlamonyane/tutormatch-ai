package com.tut.ai_tutormatch.model;

import com.tut.ai_tutormatch.enums.AdminPosition;
import com.tut.ai_tutormatch.enums.Department;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    private String employeeNumber;

    private String name;

    private String surname;

    @Enumerated(EnumType.STRING)
    private AdminPosition position;


    private String phoneNumber;

    private String officeLocation;


    @Enumerated(EnumType.STRING)
    private Department department;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}