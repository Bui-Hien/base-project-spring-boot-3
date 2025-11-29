package com.buihien.core.controller;

import com.buihien.core.dto.PaymentDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class RestPaymentController {

    private static final Logger log = LoggerFactory.getLogger(RestPaymentController.class);
    @Autowired
    private PaymentService paymentService;

    /**
     * API tạo link thanh toán VNPay
     * @param request HttpServletRequest để lấy IP client
     */
//    @GetMapping("/vn-pay/{amount}")
//    @ResponseBody
//    public ResponseData<String> pay(@PathVariable long amount, HttpServletRequest request) {
//        String paymentUrl = paymentService.createVnPayPayment(amount, request);
//        log.info("Payment url: " + paymentUrl);
//        return new ResponseData<>(HttpStatus.OK.value(),
//                "Tạo URL thanh toán thành công",
//                paymentUrl);
//    }

    /**
     * API callback từ VNPay (ReturnUrl)
     * - VNPay sẽ redirect về URL này kèm các query params
     * - Ta verify chữ ký (vnp_SecureHash) để chắc chắn dữ liệu không bị giả mạo
     */
//    @GetMapping("/public/vn-pay-callback")
//    public void payCallbackHandler(HttpServletRequest request, HttpServletResponse response) throws IOException {
//        String result = paymentService.handleVnPayCallback(request);
//        log.info(result);
//        response.sendRedirect("https://hiendev.online/transaction");
//    }
    @GetMapping("/viet-qr")
    public ResponseData<PaymentDto> getUrlVietQr(
            @RequestParam(defaultValue = "10000") Long amount) {
        PaymentDto response = paymentService.createUrlVietQr(amount);
        return new ResponseData<>(HttpStatus.OK.value(), "Tạo URL thanh toán thành công", response);
    }
}
