package com.tut.ai_tutormatch.dto;

import lombok.Data;

@Data
public class CreateAdminRequest {

    private String name;

    private String surname;

    private String email;

    private String password;

    private String department;
}