package com.tut.ai_tutormatch.dto;

import com.tut.ai_tutormatch.enums.Specialization;
import lombok.Data;

@Data
public class TutorDto {
    private Long tutorId;
    private String employeeNumber;
    private String name;
    private String surname;
    private String bio;
    private Specialization specialization;
    private Integer yearsExperience;
    private Long userId;
}
