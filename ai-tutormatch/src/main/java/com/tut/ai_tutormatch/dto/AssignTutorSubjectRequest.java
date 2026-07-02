package com.tut.ai_tutormatch.dto;

import lombok.Data;

@Data
public class AssignTutorSubjectRequest {

    private Long tutorId;

    private Long subjectId;
}