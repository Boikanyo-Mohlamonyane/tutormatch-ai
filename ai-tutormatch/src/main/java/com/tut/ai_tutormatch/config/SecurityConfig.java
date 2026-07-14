package com.tut.ai_tutormatch.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.tut.ai_tutormatch.security.JwtFilter;

@Configuration
public class SecurityConfig {

        @Autowired
        private JwtFilter jwtFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http.cors(cors -> {
                }) // ✅ enable CORS
                                .csrf(csrf -> csrf.disable()) // disable CSRF for APIs
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                // ✅ Allow preflight OPTIONS requests
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // ✅ Allow auth endpoints without JWT
                                                .requestMatchers("/api/auth/**",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui.html")
                                                .permitAll()

                                                // Role-based restrictions
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/student/**").hasRole("STUDENT")
                                                .requestMatchers("/api/tutor/**").hasRole("TUTOR")

                                                // Everything else requires authentication
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
