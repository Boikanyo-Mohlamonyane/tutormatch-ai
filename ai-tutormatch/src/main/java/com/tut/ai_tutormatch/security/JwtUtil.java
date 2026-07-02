package com.tut.ai_tutormatch.security;

import io.jsonwebtoken.*;
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

    // =========================
    // GENERATE TOKEN
    // =========================
    public static String generateToken(String email, String role) {

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION)
                )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // EXTRACT EMAIL
    // =========================
    public static String extractEmail(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}