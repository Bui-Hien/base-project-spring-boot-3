package com.buihien.core.listeners;

import com.buihien.core.CoreConstants;
import com.buihien.core.configuration.TelegramNotiBot;
import com.buihien.core.domain.SystemConfig;
import com.buihien.core.domain.security.Permission;
import com.buihien.core.domain.security.User;
import com.buihien.core.domain.security.UserPermission;
import com.buihien.core.repository.PermissionRepository;
import com.buihien.core.repository.SystemConfigRepository;
import com.buihien.core.repository.UserPermissionRepository;
import com.buihien.core.repository.UserRepository;
import com.buihien.core.util.CacheUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.bots.TelegramWebhookBot;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static com.buihien.core.CoreConstants.*;

@Component
public class CoreInitializer {
    private static final Logger log = LoggerFactory.getLogger(CoreInitializer.class);
    @Value("${endpoint.url:http://localhost:8071}")
    private String endpointUrl;

    @Bean
    @Order(1)
    CommandLineRunner setUpSystemConfig(SystemConfigRepository systemConfigRepository) {
        return args -> {
            for (CoreConstants.SystemConfig config : CoreConstants.SystemConfig.values()) {
                SystemConfig systemConfig = systemConfigRepository.findByKey(config.getKey()).orElse(null);
                if (systemConfig == null) {
                    systemConfig = new SystemConfig();
                    systemConfig.setKey(config.getKey());
                    systemConfig.setValue(config.getValue());
                    systemConfig.setType(config.getType());
                    systemConfig.setDescription(config.getDescription());
                    systemConfigRepository.save(systemConfig);
                }
            }
            log.info("✅ setUpSystemConfig successfully.");
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner loadHashSystemConfig(SystemConfigRepository systemConfigRepository) {
        return args -> {
            List<SystemConfig> list = systemConfigRepository.findAll();
            CacheUtils.loadHashSystemConfig(list);
            log.info("✅ load SystemConfig successfully.");
        };
    }

    @Bean
    CommandLineRunner initWebhook(TelegramNotiBot depositBot) {
        return args -> {
            setWebhook(depositBot);
            log.info("✅ Tất cả Telegram bots đã đăng ký webhook thành công!");
        };
    }

    private void setWebhook(TelegramWebhookBot bot) {
        try {
            String url = endpointUrl + bot.getBotPath();
            new RestTemplate().getForObject(
                    "https://api.telegram.org/bot" + bot.getBotToken() + "/setWebhook?url=" + url,
                    String.class
            );
            log.info("Webhook set: " + url);
        } catch (Exception e) {
            log.error("Webhook set failed: " + e.getMessage());
        }
    }

    @Bean
    @Order(1)
    CommandLineRunner setUpPermission(PermissionRepository permissionRepository) {
        return args -> {

            List<Permission> entityList = new ArrayList<>();

            for (String permission : CoreConstants.getListPermissions()) {
                boolean exists = permissionRepository.existsByName(permission, null);
                if (!exists) {
                    Permission entity = new Permission();
                    entity.setName(permission);
                    entity.setVoided(false);
                    entityList.add(entity);
                }
            }
            if (!entityList.isEmpty()) {
                permissionRepository.saveAll(entityList);
            }
            log.info("✅ setUpPermission successfully.");
        };
    }

    @Bean
    @Transactional
    @Order(2)
    CommandLineRunner setUpSystemAdmin(UserRepository userRepository, PermissionRepository permissionRepository, UserPermissionRepository userPermissionRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            boolean isSystemAdmin = userRepository.countUserByPermission(SYSTEM_ADMIN) > 0;
            if (!isSystemAdmin) {
                User adminUser = userRepository.findByUsername(ADMIN).orElse(new User());
                adminUser.setVoided(false);
                adminUser.setUsername(ADMIN);
                adminUser.setPassword(passwordEncoder.encode(PASS));
                adminUser.setIsEnabled(Boolean.TRUE);
                adminUser.setIsActive(Boolean.TRUE);

                Permission permission = permissionRepository.findByName(SYSTEM_ADMIN).orElseGet(() -> {
                    Permission entity = new Permission();
                    entity.setVoided(false);
                    entity.setName(SYSTEM_ADMIN);
                    entity = permissionRepository.saveAndFlush(entity);
                    return entity;
                });
                UserPermission userPermission = userPermissionRepository.findByPermissionAndUser(permission.getId(), adminUser.getId());
                if (userPermission == null) {
                    userPermission = new UserPermission();
                }
                userPermission.setVoided(false);
                userPermission.setUser(adminUser);
                userPermission.setPermission(permission);

                adminUser.setPermissions(Set.of(userPermission));

                userRepository.save(adminUser);
            }
            log.info("✅ setUpSystemAdmin successfully.");
        };
    }
}