package com.buihien.core.service;


import com.buihien.core.exception.InvalidDataException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class MailService {
    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private SpringTemplateEngine templateEngine;
    @Value("${spring.mail.from}")
    private String emailFrom;
    @Value("${spring.mail.name}")
    private String name;
    @Value("${endpoint.url-reset-password}")
    private String apiConfirmUser;
    @Value("${endpoint.url-active-user}")
    private String apiActiveUser;

    @Async("taskExecutor")
    public void sendConfirmLink(String emailTo, String username, String resetToken) {
        if (emailTo == null || username == null) {
            throw new InvalidDataException("Invalid input for sending email");
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            Context context = new Context();

            String linkConfirm = apiConfirmUser + "?resetToken=" + resetToken + "&username=" + username;

            Map<String, Object> properties = new HashMap<>();
            properties.put("linkConfirm", linkConfirm);
            properties.put("username", username);
            context.setVariables(properties);

            helper.setFrom(emailFrom, name);
            helper.setTo(emailTo);
            helper.setSubject("Rest password confirmation");
            String html = templateEngine.process("confirm-email.html", context);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new InvalidDataException("Error while sending reset link");
        }
    }

    @Async("taskExecutor")
    public void sendOtp(String emailTo, String username, String otpCode, String message, int expireMinutes) {
        if (emailTo == null || username == null || otpCode == null) {
            throw new InvalidDataException("Dữ liệu không hợp lệ khi gửi email OTP");
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.name());

            helper.setFrom(emailFrom, name);
            helper.setTo(emailTo);
            helper.setSubject("Mã OTP xác thực - " + message);

            // Nội dung email bằng tiếng Việt
            StringBuilder text = new StringBuilder();
            text.append("Xin chào ").append(username).append(",\n\n");
            text.append("Bạn đang thực hiện: ").append(message).append(".\n");
            text.append("Mã OTP của bạn là: ").append(otpCode).append("\n\n");
            text.append("Lưu ý: Mã này chỉ có hiệu lực trong vòng ")
                    .append(expireMinutes).append(" phút.\n\n");
            text.append("Trân trọng,\n");
            text.append(name);

            helper.setText(text.toString(), false);

            mailSender.send(mimeMessage);

            logger.info("OTP sent successfully to {} (expire {} minutes)", emailTo, expireMinutes);

        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Error while sending OTP email to {}", emailTo, e);
            throw new InvalidDataException("Có lỗi khi gửi email OTP");
        }
    }


    @Async("taskExecutor")
    public void sendChangePassword(String emailTo, String username, boolean isNotiChangePassword) {
        if (emailTo == null || username == null) {
            throw new InvalidDataException("Dữ liệu gửi email không hợp lệ.");
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.name());

            helper.setFrom(emailFrom, name);
            helper.setTo(emailTo);

            String subject;
            String content;

            if (isNotiChangePassword) {
                subject = "Xác nhận đổi mật khẩu thành công";
                content = """
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Bạn vừa đổi mật khẩu tài khoản của mình thành công.</p>
                            <p>Nếu đây là bạn, bạn có thể bỏ qua email này.</p>
                            <p>Nếu bạn KHÔNG thực hiện thao tác này, vui lòng <strong>đặt lại mật khẩu ngay lập tức</strong> để bảo vệ tài khoản của bạn.</p>
                            <br/>
                            <p>Trân trọng,<br/>%s</p>
                        """.formatted(username, name);

            } else { // FAILED_ATTEMPT
                subject = "Cảnh báo: Có người cố gắng đổi mật khẩu tài khoản của bạn";
                content = """
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Hệ thống ghi nhận một yêu cầu <strong>đổi mật khẩu</strong> cho tài khoản của bạn, nhưng mật khẩu cũ được nhập không đúng.</p>
                            <p>Nếu đó là bạn, vui lòng thử lại.</p>
                            <p>Nếu KHÔNG phải bạn, vui lòng <strong>đặt lại mật khẩu ngay</strong> để đảm bảo an toàn cho tài khoản.</p>
                            <br/>
                            <p>Trân trọng,<br/>%s</p>
                        """.formatted(username, name);
            }

            helper.setSubject(subject);
            helper.setText(content, true); // true => gửi HTML email

            mailSender.send(mimeMessage);

        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Lỗi khi gửi email đến {}: {}", emailTo, e.getMessage(), e);
            throw new InvalidDataException("Không thể gửi email thông báo đổi mật khẩu.");
        }
    }

    @Async("taskExecutor")
    public void sendActiveUser(String email, String username, String token) {
        if (!StringUtils.hasText(email) || !StringUtils.hasText(username) || !StringUtils.hasText(token)) {
            throw new InvalidDataException("Thiếu thông tin để gửi email kích hoạt tài khoản.");
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.name());

            helper.setFrom(emailFrom, name);
            helper.setTo(email);
            helper.setSubject("Kích hoạt tài khoản của bạn");

            String activeLink = String.format("%s?token=%s", apiActiveUser, token);

            String content = """
                        <html>
                            <body style="font-family: Arial, sans-serif; color: #333;">
                                <p>Xin chào <strong>%s</strong>,</p>
                                <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
                                <p>Vui lòng nhấn vào nút bên dưới để <strong>kích hoạt tài khoản</strong> của bạn:</p>
                                <p style="margin: 20px 0;">
                                    <a href="%s" target="_blank" 
                                       style="display:inline-block; padding:10px 20px; background-color:#1E90FF; 
                                              color:#fff; text-decoration:none; border-radius:5px;">
                                        Kích hoạt ngay
                                    </a>
                                </p>
                                <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                                <br/>
                                <p>Trân trọng,<br/>%s</p>
                            </body>
                        </html>
                    """.formatted(username, activeLink, name);

            helper.setText(content, true); // true = HTML email
            mailSender.send(mimeMessage);

        } catch (MessagingException | UnsupportedEncodingException e) {
            logger.error("Lỗi khi gửi email kích hoạt đến {}: {}", email, e.getMessage(), e);
            throw new InvalidDataException("Không thể gửi email kích hoạt tài khoản. Vui lòng thử lại sau.");
        }
    }
}