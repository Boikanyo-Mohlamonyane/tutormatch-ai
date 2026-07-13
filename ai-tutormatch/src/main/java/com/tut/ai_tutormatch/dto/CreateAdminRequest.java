package com.tut.ai_tutormatch.dto;

import com.tut.ai_tutormatch.enums.AdminPosition;
import com.tut.ai_tutormatch.enums.Department;
import lombok.Data;

@Data
public class CreateAdminRequest {

    private String name;

    private String surname;

    private String email;

    private String password;

    private Department department;

    private String phoneNumber;

    private String officeLocation;

    private AdminPosition position;

}