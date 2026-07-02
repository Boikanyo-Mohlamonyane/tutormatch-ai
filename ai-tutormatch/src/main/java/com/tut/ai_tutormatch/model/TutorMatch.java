package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "tutor_matches")
public class TutorMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long matchId;

    private Double matchScore;

    private String recommendationReason;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;
}