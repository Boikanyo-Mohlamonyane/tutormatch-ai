package com.tut.ai_tutormatch.dto;

import com.tut.ai_tutormatch.enums.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long userId;
    private String email;
    private Role role;
}
