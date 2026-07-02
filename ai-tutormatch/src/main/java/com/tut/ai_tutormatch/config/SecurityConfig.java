package com.tut.ai_tutormatch.config;

import com.tut.ai_tutormatch.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()).sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**"
                                ,"/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html").permitAll()

                        .requestMatchers(
                                "/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/student/**").hasRole("STUDENT")
                        .requestMatchers("/api/tutor/**").hasRole("TUTOR")

                        .anyRequest().authenticated())
                        .addFilterBefore(
                                jwtFilter,
                                UsernamePasswordAuthenticationFilter.class
                        );

        return http.build();
    }



}