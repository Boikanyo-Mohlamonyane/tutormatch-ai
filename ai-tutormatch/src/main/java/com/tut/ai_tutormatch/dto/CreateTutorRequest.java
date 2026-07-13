package com.tut.ai_tutormatch.dto;

import com.tut.ai_tutormatch.enums.Specialization;
import lombok.Data;

@Data
public class CreateTutorRequest {

   // private String employeeNumber;

    private String name;

    private String surname;

    private String email;

    private String password;

    private Specialization specialization;

    private String bio;

    private Integer yearsExperience;
}