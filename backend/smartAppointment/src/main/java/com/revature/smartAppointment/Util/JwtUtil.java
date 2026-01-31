package com.revature.smartAppointment.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "9f3c8b2e4a7d1c6f0e5b8d2a4c7f9e1b6a0d3c5e8f2b7a4d9c1e6b5f8a0";

    private static final long EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateToken(String username, Integer user_id, String roleName) {
        return Jwts.builder()
                .subject(username)
                .claim("id", user_id)
                .claim("privilege", roleName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public Integer extractId(String token) {
        return extractAllClaims(token).get("id", Integer.class);
    }

    public String extractPrivilege(String token) {
        return extractAllClaims(token).get("privilege", String.class);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

}
