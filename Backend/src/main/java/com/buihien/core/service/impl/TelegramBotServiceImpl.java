package com.buihien.core.service.impl;

import com.buihien.core.configuration.TelegramNotiBot;
import com.buihien.core.service.TelegramBotService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TelegramBotServiceImpl implements TelegramBotService {
    private static final Logger log = LoggerFactory.getLogger(TelegramBotServiceImpl.class);
    @Autowired
    private TelegramNotiBot telegramTransactionBot;

    @Override
    @Async("taskExecutor")
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendMessageToChatIds(String message, List<Long> chatIds) {
        try {
            if (!chatIds.isEmpty()) {
                telegramTransactionBot.sendMessageToChatIds(message, chatIds);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }
}
