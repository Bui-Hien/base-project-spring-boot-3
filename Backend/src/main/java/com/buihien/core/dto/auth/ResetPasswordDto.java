package com.buihien.core.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class ResetPasswordDto {
    @NotBlank(message = "Liên kết không hợp lệ")
    private String secretKey;
    @NotBlank(message = "Mật khẩu là bắt buộc")
    private String password;
    @NotBlank(message = "Mật khẩu xác nhận là bắt buộc")
    private String confirmPassword;

    public ResetPasswordDto() {
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
