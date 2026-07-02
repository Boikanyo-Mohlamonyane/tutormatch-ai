package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    private String name;

    private String surname;

    private String department;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}