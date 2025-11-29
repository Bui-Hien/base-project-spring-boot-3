package com.buihien.core.service;

import java.util.List;

public interface TelegramBotService {
    void sendMessageToChatIds(String message, List<Long> chatIds);
}
