package com.buihien.core.dto;

import java.util.UUID;

public class PaymentDto {
    private String paymentUrl;
    private UUID transactionId;

    public PaymentDto() {
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public UUID getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(UUID transactionId) {
        this.transactionId = transactionId;
    }
}
