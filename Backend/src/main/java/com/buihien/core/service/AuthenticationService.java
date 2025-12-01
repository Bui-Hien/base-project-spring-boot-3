package com.buihien.core.service;

import com.buihien.core.dto.auth.*;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthenticationService {
    TokenResponseDto accessToken(SignInDto dto, HttpServletRequest request);

    TokenResponseDto refreshToken(TokenResponseDto dto, HttpServletRequest request);

    void forgotPassword(ForgotPasswordDto dto, HttpServletRequest request);

    void resetPassword(ResetPasswordDto dto);

    void changePassword(ChangePasswordDto dto);

    void removeToken(TokenResponseDto dto, HttpServletRequest request);
}
