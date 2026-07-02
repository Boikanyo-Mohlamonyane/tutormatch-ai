package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "student_performance")
public class StudentPerformance {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long performanceId;

    @ManyToOne @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne @JoinColumn(name = "subject_id")
    private Subject subject;

    private Double testScore;
    private Double assignmentScore;
    private Double examScore;
    private Double finalMark;
    private String performanceStatus;

}