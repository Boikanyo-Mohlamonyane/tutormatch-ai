package com.tut.ai_tutormatch.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET =
            "supersecretkeysupersecretkeysupersecretkey123!";

    private static final long EXPIRATION =
            1000 * 60 * 60 * 10;

    private static final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // =====================================================
    // GENERATE TOKEN
    // =====================================================
    public static String generateToken(
            Long userId,
            Long studentId,
            Long tutorId,
            Long adminId,
            String email,
            String role
    ) {

        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("studentId", studentId)
                .claim("tutorId", tutorId)
                .claim("adminId", adminId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // =====================================================
    // GET ALL CLAIMS
    // =====================================================
    public static Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =====================================================
    // EMAIL
    // =====================================================
    public static String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // =====================================================
    // ROLE
    // =====================================================
    public static String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // =====================================================
    // USER ID
    // =====================================================
    public static Long extractUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    // =====================================================
    // STUDENT ID
    // =====================================================
    public static Long extractStudentId(String token) {
        return getClaims(token).get("studentId", Long.class);
    }

    // =====================================================
    // TUTOR ID
    // =====================================================
    public static Long extractTutorId(String token) {
        return getClaims(token).get("tutorId", Long.class);
    }

    // =====================================================
    // ADMIN ID
    // =====================================================
    public static Long extractAdminId(String token) {
        return getClaims(token).get("adminId", Long.class);
    }

    // =====================================================
    // VALIDATE TOKEN
    // =====================================================
    public static boolean validateToken(String token) {

        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}