package com.tut.ai_tutormatch.controller.auth;

import com.tut.ai_tutormatch.dto.AuthRequest;
import com.tut.ai_tutormatch.dto.LoginRequest;
import com.tut.ai_tutormatch.dto.LoginResponse;
import com.tut.ai_tutormatch.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}