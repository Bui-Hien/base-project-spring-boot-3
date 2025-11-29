package com.buihien.core.service.impl;

import com.buihien.core.CoreConstants;
import com.buihien.core.domain.SystemConfig;
import com.buihien.core.dto.PaymentDto;
import com.buihien.core.exception.InvalidDataException;
import com.buihien.core.exception.NotFoundException;
import com.buihien.core.repository.SystemConfigRepository;
import com.buihien.core.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final String VNP_TMNCODE = "GX3UI8Q9";
    private static final String VNP_HASH_SECRET = "6F0TSJJWOCSOHXN286GVCGNR0NKRLHR2";
    private static final String VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private static final String VNP_RETURN_URL = "https://hiendev.online/api/payment/vn-pay-callback";
    private static final DateTimeFormatter VN_PAY_DATE_FMT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);
    @Autowired
    private SystemConfigRepository systemConfigRepository;

    @Transactional
    public String createVnPayPayment(long amountInput, HttpServletRequest request) {
        try {
            BigDecimal amount = BigDecimal.valueOf(amountInput).multiply(BigDecimal.valueOf(100));

            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_IpAddr = getClientIpAddr(request);
            String vnp_Locale = "vn";
            String vnp_CurrCode = "VND";
            String vnp_OrderType = "other";

            // Unique TxnRef
            String vnp_TxnRef = "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

            ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));

            // Params map
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", VNP_TMNCODE);
            vnp_Params.put("vnp_Amount", String.valueOf(amount.longValue()));
            vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", vnp_OrderType);
            vnp_Params.put("vnp_Locale", vnp_Locale);
            vnp_Params.put("vnp_ReturnUrl", VNP_RETURN_URL);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            vnp_Params.put("vnp_CreateDate", now.format(VN_PAY_DATE_FMT));
            vnp_Params.put("vnp_ExpireDate", now.plusMinutes(30).format(VN_PAY_DATE_FMT));

            // Sort alphabetically
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);

            // Build hashData + query
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext(); ) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                            .append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }

            // SecureHash
            String vnp_SecureHash = hmacSHA512(VNP_HASH_SECRET, hashData.toString());
            query.append("&vnp_SecureHash=").append(vnp_SecureHash);

            return VNP_URL + "?" + query;
        } catch (Exception e) {
            throw new RuntimeException("Error while creating VNPay payment URL", e);
        }
    }

    @Override
    public String handleVnPayCallback(HttpServletRequest request) {
        try {
            // Lấy toàn bộ tham số có tiền tố vnp_
            Map<String, String> fields = new HashMap<>();
            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
                String paramName = params.nextElement();
                String paramValue = request.getParameter(paramName);
                if (paramValue != null && paramName.startsWith("vnp_")) {
                    fields.put(paramName, paramValue);
                }
            }

            // Lấy hash từ callback
            String vnp_SecureHash = fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType"); // không cần hash loại
            String vnp_TxnRef = fields.get("vnp_TxnRef");
            log.info("vnp_TxnRef", vnp_TxnRef);

            // Sắp xếp alphabet
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            // Build lại hashData
            StringBuilder hashData = new StringBuilder();
            for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext(); ) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            // Re-generate checksum
            String computedHash = hmacSHA512(VNP_HASH_SECRET, hashData.toString());

            String vnpTxnRef = fields.get("vnp_TxnRef");
            String vnpAmount = fields.get("vnp_Amount");
            String vnpBankCode = fields.get("vnp_BankCode");
            String responseCode = fields.get("vnp_ResponseCode");

            // Compare checksum
            if (computedHash.equalsIgnoreCase(vnp_SecureHash)) {
                if (CoreConstants.VnpRspCode.SUCCESS.getValue().equals(responseCode)) {
                    return "https://hiendev.online/transaction";
                } else {
                    return "https://hiendev.online/transaction?err";
                }
            } else {
                return "https://hiendev.online/transaction?INVALID";
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return "https://hiendev.online/transaction?verifying";
        }
    }

    @Override
    public PaymentDto createUrlVietQr(Long amount) {
        try {
            // 🧩 Validate input
            if (amount == null || amount <= 0) {
                throw new InvalidDataException("Số tiền không hợp lệ.");
            }

            // 🧩 Load config từ DB
            SystemConfig baseUrlConfig = systemConfigRepository
                    .findByKey(CoreConstants.SystemConfig.VIET_QR_URL.getKey())
                    .orElseThrow(() -> new InvalidDataException("Thiếu cấu hình VietQR URL."));
            SystemConfig accountNameConfig = systemConfigRepository
                    .findByKey(CoreConstants.SystemConfig.ACCOUNT_BANK_NAME.getKey())
                    .orElseThrow(() -> new InvalidDataException("Thiếu cấu hình tên tài khoản ngân hàng."));

            String baseUrl = baseUrlConfig.getValue();
            String accountName = accountNameConfig.getValue();
            // 🧩 Chuẩn bị description QR (clear, readable)
            String descriptionRaw = String.format("NAP_TIEN");

            // 🧩 Encode các chuỗi để đảm bảo URL hợp lệ
            String encodedAccountName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);
            String encodedDescription = URLEncoder.encode(descriptionRaw, StandardCharsets.UTF_8);

            // 🧩 Build VietQR URL final
            String vietQrUrl = String.format(
                    "%s?accountName=%s&amount=%d&addInfo=%s",
                    baseUrl, encodedAccountName, amount, encodedDescription
            );

            PaymentDto response = new PaymentDto();
            response.setPaymentUrl(vietQrUrl);

            return response;

        } catch (InvalidDataException | NotFoundException e) {
            throw e; // giữ nguyên để controller handle hợp lệ
        } catch (Exception e) {
            log.error("Error creating VietQR URL: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating VietQR URL: " + e.getMessage(), e);
        }
    }


    private static String hmacSHA512(String key, String data) throws Exception {
        Mac hmac512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac512.init(secretKey);
        byte[] hashBytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(hashBytes.length * 2);
        for (byte b : hashBytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }

    private static String getClientIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        if (ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}
