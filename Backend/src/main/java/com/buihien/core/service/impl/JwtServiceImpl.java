package com.buihien.core.service.impl;

import com.buihien.core.exception.InvalidDataException;
import com.buihien.core.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static com.buihien.core.CoreConstants.TokenType.*;

@Service
public class JwtServiceImpl implements JwtService {
    private static final Logger log = LoggerFactory.getLogger(JwtServiceImpl.class);
    @Value("${jwt.expiryHour}")
    private long expiryHour;

    @Value("${jwt.expiryDay}")
    private long expiryDay;

    @Value("${jwt.accessKey}")
    private String accessKey;

    @Value("${jwt.refreshKey}")
    private String refreshKey;

    @Value("${jwt.resetKey}")
    private String resetKey;

    @Value("${jwt.activeUserKey}")
    private String activeUserKey;

    @Override
    public String generateToken(UserDetails user) {
        return generateToken(new HashMap<>(), user);
    }

    @Override
    public String generateRefreshToken(UserDetails user) {
        return generateRefreshToken(new HashMap<>(), user);
    }

    @Override
    public String generateResetToken(UserDetails user) {
        return generateResetToken(new HashMap<>(), user);
    }

    @Override
    public String generateActiveUserToken(UserDetails user) {
        return generateActiveUserToken(new HashMap<>(), user);
    }

    @Override
    public String extractUsername(String token, int type) {
        return extractClaim(token, type, Claims::getSubject);
    }

    @Override
    public boolean isValid(String token, int type, UserDetails userDetails) {
        final String username = extractUsername(token, type);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token, type));
    }

    private String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        List<String> permissions = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        claims.put("permissions", permissions);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * expiryHour))
                .signWith(getKey(ACCESS_TOKEN.getValue()), SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateRefreshToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * expiryDay))
                .signWith(getKey(REFRESH_TOKEN.getValue()), SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateResetToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * expiryHour))
                .signWith(getKey(RESET_TOKEN.getValue()), SignatureAlgorithm.HS256)
                .compact();
    }

    private String generateActiveUserToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * expiryHour))
                .signWith(getKey(ACTIVE_USER_TOKEN.getValue()), SignatureAlgorithm.HS256)
                .compact();
    }


    private Key getKey(int type) {
        if (type == ACCESS_TOKEN.getValue()) {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(accessKey));
        } else if (type == REFRESH_TOKEN.getValue()) {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshKey));
        } else if (type == RESET_TOKEN.getValue()) {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(resetKey));
        } else if (type == ACTIVE_USER_TOKEN.getValue()) {
            return Keys.hmacShaKeyFor(Decoders.BASE64.decode(activeUserKey));
        } else {
            throw new InvalidDataException("Invalid token type");
        }
    }

    private <T> T extractClaim(String token, int type, Function<Claims, T> claimResolver) {
        final Claims claims = extraAllClaim(token, type);
        return claimResolver.apply(claims);
    }

    private Claims extraAllClaim(String token, int type) {
        return Jwts.parserBuilder().setSigningKey(getKey(type)).build().parseClaimsJws(token).getBody();
    }

    @Override
    public boolean isTokenExpired(String token, int type) {
        try {
            Date expiration = extractExpiration(token, type);
            return expiration.before(new Date());
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            log.error(ex.getMessage());
            return true; // token đã hết hạn
        }
    }

    private Date extractExpiration(String token, int type) {
        return extractClaim(token, type, Claims::getExpiration);
    }

}
