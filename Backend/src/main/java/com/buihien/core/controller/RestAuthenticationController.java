package com.buihien.core.controller;

import com.buihien.core.dto.auth.*;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/auth")
public class RestAuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/access-token")
    public ResponseData<TokenResponseDto> accessToken(@Valid @RequestBody SignInDto dto, HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Đăng nhập thành công", authenticationService.accessToken(dto, request)); // 200 - vì đây là xác thực thành công
    }

    @PostMapping("/refresh-token")
    public ResponseData<TokenResponseDto> refreshToken(@Valid @RequestBody TokenResponseDto dto, HttpServletRequest request) {
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Lấy refresh token thành công", authenticationService.refreshToken(dto, request));
    }

    @PostMapping("/remove-token")
    public ResponseData<TokenResponseDto> removeToken(@Valid @RequestBody TokenResponseDto dto, HttpServletRequest request) {
        authenticationService.removeToken(dto, request);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Xóa token thành công");
    }

    @PostMapping("/forgot-password")
    public ResponseData<Boolean> forgotPassword(@Valid @RequestBody ForgotPasswordDto dto, HttpServletRequest request) {
        authenticationService.forgotPassword(dto, request);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Thông tin đã được gửi tới mail của bạn", true);
    }

    @PostMapping("/reset-password")
    public ResponseData<Boolean> resetPassword(@Valid @RequestBody ResetPasswordDto dto) {
        authenticationService.resetPassword(dto);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Đổi mật khẩu thành công", true);
    }

    @PostMapping("/change-password")
    public ResponseData<Void> changePassword(@Valid @RequestBody ChangePasswordDto dto) {
        authenticationService.changePassword(dto);
        return new ResponseData<>(HttpStatus.ACCEPTED.value(), "Đổi mật khẩu thành công");
    }
}
