package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    @Column(unique = true)
    private String studentNumber;

    private String name;

    private String surname;

    private String learningStyle;

    private Double academicAverage;

    private String riskLevel;

    // LOGIN ACCOUNT
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}