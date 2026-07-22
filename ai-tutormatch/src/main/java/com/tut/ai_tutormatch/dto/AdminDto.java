package com.tut.ai_tutormatch.dto;

import com.tut.ai_tutormatch.enums.AdminPosition;
import com.tut.ai_tutormatch.enums.Department;
import lombok.Data;

@Data
public class AdminDto {
    private Long adminId;
    private String employeeNumber;
    private String name;
    private String surname;
    private AdminPosition position;
    private String phoneNumber;
    private String officeLocation;
    private Department department;
    private Long userId;
}
