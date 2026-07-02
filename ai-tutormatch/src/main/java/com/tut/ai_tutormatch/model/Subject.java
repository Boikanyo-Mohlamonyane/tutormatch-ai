package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subjectId;

    private String subjectCode;

    private String subjectName;

    private String description;
}