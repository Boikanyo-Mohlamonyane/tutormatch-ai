package com.tut.ai_tutormatch.dto;

import com.tut.ai_tutormatch.enums.Role;
import lombok.Data;

@Data
public class AuthRequest {
        private String name;

        private String surname;

        private String email;

        private String password;

        private String learningStyle;

        private Double academicAverage;

        private String riskLevel;

}
