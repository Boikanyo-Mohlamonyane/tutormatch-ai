package com.tut.ai_tutormatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutorSubjectResponse {

    private Long tutorId;
    private String tutorName;
    private String specialization;
    private Integer yearsExperience;

    private Long subjectId;
    private String subjectName;
}