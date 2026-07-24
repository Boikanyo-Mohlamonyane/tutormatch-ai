package com.tut.ai_tutormatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long bookingId;

    private Long tutorId;
    private String tutorName;

    private Long subjectId;
    private String subjectName;

    private LocalDateTime sessionDate;

    private String status;
}