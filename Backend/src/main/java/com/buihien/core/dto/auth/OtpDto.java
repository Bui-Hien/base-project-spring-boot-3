package com.buihien.core.dto.auth;

import java.time.LocalDateTime;

public class OtpDto {
    private String opt;
    private LocalDateTime date;

    public OtpDto() {
        this.date = LocalDateTime.now();
    }

    public OtpDto(String opt, int expirationMinutes) {
        this.opt = opt;
        this.date = LocalDateTime.now().plusMinutes(expirationMinutes);
    }

    public String getOpt() {
        return opt;
    }

    public void setOpt(String opt) {
        this.opt = opt;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
