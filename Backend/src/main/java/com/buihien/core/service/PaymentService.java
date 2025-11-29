package com.buihien.core.service;

import com.buihien.core.dto.PaymentDto;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    String createVnPayPayment(long amount, HttpServletRequest request);

    String handleVnPayCallback(HttpServletRequest request);

    PaymentDto createUrlVietQr(Long amount);
}
