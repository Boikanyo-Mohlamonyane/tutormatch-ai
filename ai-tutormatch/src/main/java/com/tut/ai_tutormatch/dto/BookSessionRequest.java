package com.tut.ai_tutormatch.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookSessionRequest {

    private Long studentId;
    private Long tutorId;
    private Long subjectId;
    private LocalDateTime sessionDate;

}