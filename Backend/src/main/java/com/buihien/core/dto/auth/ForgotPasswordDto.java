package com.buihien.core.dto.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@Valid
public class ForgotPasswordDto {
    @NotBlank(message = "Tên đăng nhập là trường bắt buộc")
    private String username;

    public ForgotPasswordDto() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
