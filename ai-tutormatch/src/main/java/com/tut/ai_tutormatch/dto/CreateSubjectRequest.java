package com.tut.ai_tutormatch.dto;

import lombok.Data;

@Data
public class CreateSubjectRequest {

    private String subjectCode;

    private String subjectName;

    private String description;
}