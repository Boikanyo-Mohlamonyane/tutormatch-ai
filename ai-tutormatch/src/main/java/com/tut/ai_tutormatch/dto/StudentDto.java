package com.tut.ai_tutormatch.dto;

import lombok.Data;

@Data
public class StudentDto {
    private Long studentId;
    private String studentNumber;
    private String name;
    private String surname;
    private String learningStyle;
    private Double academicAverage;
    private String riskLevel;
    private Long userId;
}
