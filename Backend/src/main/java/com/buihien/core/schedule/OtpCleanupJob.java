package com.buihien.core.schedule;

import com.buihien.core.dto.auth.OtpDto;
import com.buihien.core.generic.GenericCache;
import com.buihien.core.util.CacheUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.Map;

@Component
public class OtpCleanupJob {

    // OTP registration TTL (minutes)
    @Value("${system.otp.registration-expiration-minutes:1}")
    private int registrationOtpExpirationMinutes;

    // OTP wallet TTL (minutes)
    @Value("${system.otp.wallet-expiration-minutes:1}")
    private int walletOtpExpirationMinutes;

    // Job chạy theo interval cấu hình
    @Scheduled(fixedRateString = "#{${system.job.otp-cleanup-interval-minutes: 5} * 60 * 1000}")
    public void cleanupOtpJob() {
    }

    // Logic chung xoá OTP quá hạn
    private void clearOtpCache(GenericCache<String, OtpDto> cache, int expirationMinutes, String cacheName) {
        int removedCount = 0;
        LocalDateTime now = LocalDateTime.now();

        Iterator<Map.Entry<String, OtpDto>> it = cache.getAll().entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, OtpDto> entry = it.next();
            OtpDto otp = entry.getValue();
            if (otp != null && otp.getDate().plusMinutes(expirationMinutes).isBefore(now)) {
                it.remove();
                removedCount++;
            }
        }

        if (removedCount > 0) {
            System.out.println("[" + cacheName + "] Removed " + removedCount + " expired OTP(s)");
        }
    }
}
