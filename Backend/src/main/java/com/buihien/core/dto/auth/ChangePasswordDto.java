package com.buihien.core.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordDto {
    @NotBlank(message = "Mật khẩu cũ là trường bắt buộc")
    private String oldPassword;
    @NotBlank(message = "Mật khẩu là bắt buộc")
    private String password;
    @NotBlank(message = "Mật khẩu xác nhận là bắt buộc")
    private String confirmPassword;

    public ChangePasswordDto() {
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
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
