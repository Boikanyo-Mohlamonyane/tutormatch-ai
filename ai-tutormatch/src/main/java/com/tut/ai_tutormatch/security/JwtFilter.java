package com.tut.ai_tutormatch.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

        @Autowired
        private UserDetailsService userDetailsService;

        @Override
        protected boolean shouldNotFilter(HttpServletRequest request) {
                String path = request.getServletPath();
                // ✅ Skip JWT validation for auth endpoints (login/register)
                System.out.println("JwtFilter skip? path=" + path);
                return path.startsWith("/api/auth/");
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain) throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");
                String token = null;
                String email = null;

                // ✅ Extract JWT if present
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        token = authHeader.substring(7);
                        try {
                                email = JwtUtil.extractEmail(token);
                        } catch (Exception e) {
                                System.out.println("Invalid JWT: " + e.getMessage());
                        }
                }

                // ✅ Authenticate user if token is valid and no authentication exists yet
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities());

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                }

                filterChain.doFilter(request, response);
        }
}
