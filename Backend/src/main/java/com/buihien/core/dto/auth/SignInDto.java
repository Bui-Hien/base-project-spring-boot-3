package com.buihien.core.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class SignInDto {
    @NotBlank(message = "Tên đăng nhập là bắt buộc")
    private String username;
    @NotBlank(message = "Mật khẩu là bắt buộc")
    private String password;

    public SignInDto() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
