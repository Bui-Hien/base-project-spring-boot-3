package com.buihien.core.service;


import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    String generateToken(UserDetails user);

    String generateRefreshToken(UserDetails user);

    String generateResetToken(UserDetails user);

    String generateActiveUserToken(UserDetails user);

    String extractUsername(String token, int type);

    boolean isValid(String token, int type, UserDetails user);

    boolean isTokenExpired(String token, int type);
}
