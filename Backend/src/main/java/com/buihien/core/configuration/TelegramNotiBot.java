package com.buihien.core.configuration;

import com.buihien.core.domain.security.User;
import com.buihien.core.repository.UserRepository;
import com.google.common.util.concurrent.RateLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramWebhookBot;
import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TelegramNotiBot extends TelegramWebhookBot {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotiBot.class);
    private final Map<Long, RateLimiter> userRateLimiters = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    @Value("${telegram.bots.transaction.username}")
    private String botUsername;

    @Value("${telegram.bots.transaction.token}")
    private String botToken;

    @Value("${telegram.bots.transaction.webhookPath}")
    private String botWebhookPath;

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public String getBotPath() {
        return botWebhookPath;
    }

    @Override
    public BotApiMethod<?> onWebhookUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            Long chatId = update.getMessage().getChatId();
            String text = update.getMessage().getText().trim();

            // Giới hạn tần suất user gửi message (RateLimiter)
            RateLimiter limiter = userRateLimiters.computeIfAbsent(chatId, id -> RateLimiter.create(1.0));

            if (!limiter.tryAcquire()) {
                log.warn("⚠️ UserDto {} bị rate-limit, bỏ qua message: {}", chatId, text);
                return null;
            }

            try {
                // ✅ Trường hợp người dùng bấm link https://t.me/your_bot?start=<UUID>
                if (text.startsWith("/start")) {
                    String token = text.replace("/start", "").trim();
                    if (token.isEmpty()) {
                        execute(new SendMessage(chatId.toString(), "Vui lòng truy cập link từ website để liên kết tài khoản."));
                        return null;
                    }

                    UUID userId;
                    try {
                        userId = UUID.fromString(token);
                    } catch (IllegalArgumentException e) {
                        log.error("Token '{}' không phải UUID hợp lệ", token);
                        execute(new SendMessage(chatId.toString(), "Mã liên kết không hợp lệ."));
                        return null;
                    }

                    // Tìm user theo UUID
                    User currentUser = userRepository.findById(userId).orElse(null);
                    if (currentUser == null) {
                        execute(new SendMessage(chatId.toString(), "Không tìm thấy tài khoản tương ứng."));
                        return null;
                    }

                    // Lưu chatId vào user
//                    currentUser.setChatId(chatId);
                    userRepository.save(currentUser);

//                    log.info("Liên kết thành công user={} với chatId={}", currentUser.getDisplayName(), chatId);

                    // Gửi tin nhắn xác nhận
                    execute(new SendMessage(chatId.toString(),
                            "🎉 Liên kết tài khoản thành công!\nBạn sẽ nhận thông báo qua Telegram."));
                }
            } catch (Exception e) {
                log.error("onWebhookUpdateReceived: Lỗi khi xử lý chatId={} text='{}'", chatId, text, e);
            }
        }

        return null;
    }


    /**
     * Gửi 1 message tới list chatId
     */
    public void sendMessageToChatIds(String message, List<Long> chatIds) {
        if (chatIds == null || chatIds.isEmpty()) {
            log.warn("sendMessageToChatIds: chatIds is empty, skip send message='{}'", message);
            return;
        }

        for (Long chatId : chatIds) {
            if (chatId == null) continue;

            SendMessage sendMessage = new SendMessage(chatId.toString(), message);
            try {
                execute(sendMessage);
                log.info("sendMessageToChatIds: sent message='{}' to chatId={}", message, chatId);
            } catch (TelegramApiException e) {
                log.error("sendMessageToChatIds: failed to send message='{}' to chatId={}", message, chatId, e);
            }
        }
    }
}