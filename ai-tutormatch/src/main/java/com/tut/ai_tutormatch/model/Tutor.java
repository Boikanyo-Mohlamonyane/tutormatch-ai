package com.tut.ai_tutormatch.model;

import com.tut.ai_tutormatch.enums.Specialization;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "tutors")
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tutorId;

    private String employeeNumber;

    private String name;

    private String surname;

    private String bio;

    @Enumerated(EnumType.STRING)
    private Specialization specialization;

    private Integer yearsExperience;

    // LOGIN ACCOUNT
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}