package com.tut.ai_tutormatch.dto;

import lombok.Data;

@Data
public class CreateTutorRequest {

    private String employeeNumber;

    private String name;

    private String surname;

    private String email;

    private String password;

    private String specialization;

    private Integer yearsExperience;
}