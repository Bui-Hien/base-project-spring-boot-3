package com.buihien.core.controller;

import com.buihien.core.configuration.TelegramNotiBot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
import org.telegram.telegrambots.meta.api.objects.Update;

@RestController
@RequestMapping("/api/telegram")
public class RestTelegramWebhookController {
    @Autowired
    private TelegramNotiBot telegramNotiBot;

    @PostMapping("/public/noti")
    public BotApiMethod<?> noti(@RequestBody Update update) {
        return telegramNotiBot.onWebhookUpdateReceived(update);
    }
}
