package com.tut.ai_tutormatch.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "tutor_subjects")
public class TutorSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;


}