package com.tut.ai_tutormatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionBookingDto {

    private Long bookingId;
    private String sessionDate;
    private String status;
    private String subjectName;
    private TutorDTO tutor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TutorDTO {
        private String name;
        private String surname;
        private String specialization;
        private int yearsExperience;
    }
}
