package com.buihien.core.util;

import com.buihien.core.dto.auth.OtpDto;
import org.springframework.beans.factory.annotation.Value;

import java.security.SecureRandom;

public class OptUtils {
    private static final SecureRandom random = new SecureRandom();

    // OTP registration TTL (minutes)
    @Value("${system.otp.registration-expiration-minutes:1}")
    private static int registrationOtpExpirationMinutes;

    // OTP wallet TTL (minutes)
    @Value("${system.otp.wallet-expiration-minutes:1}")
    private static int walletOtpExpirationMinutes;

    // Tạo OTP 6 số (000000 -> 999999)
    public static String generateOTP() {
        int otp = 100000 + random.nextInt(900000); // luôn đủ 6 số
        return String.valueOf(otp);
    }

    public static OtpDto getWalletOpt() {
        return new OtpDto(OptUtils.generateOTP(), walletOtpExpirationMinutes);
    }
}
