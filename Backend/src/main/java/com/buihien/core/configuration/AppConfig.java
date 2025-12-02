package com.buihien.core.configuration;

import com.buihien.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableAsync
@EnableJpaAuditing
@EnableScheduling
@EnableMethodSecurity
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class AppConfig {
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    @Autowired
    private UserService userService;
    @Autowired
    private PreFilter preFilter;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String[] WHITE_LIST = {
            "/api/auth/access-token",
            "/api/auth/refresh-token",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/public/**",
            "/api/payment/public/**",
            "/api/telegram/public/**",
            "/api/post/public/**",
            "/api/file-description/public/**",
            "/api/system-config/public/**",
            "/api/notification/public/**",
            "/api/account/public/**",
            "/api/system-statistic/public/**",
            "/api/user/public/**",
            "/api/account-category/public/**",
            "/api/video/hls/*/*.ts"
    };

    @Bean
    public SecurityFilterChain configure(@NonNull HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    for (String origin : allowedOrigins.split(",")) {
                        corsConfig.addAllowedOrigin(origin.trim());
                    }
                    corsConfig.addAllowedMethod("*");
                    corsConfig.addAllowedHeader("*");
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))

                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(WHITE_LIST).permitAll()
                                .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .authenticationProvider(provider())
                .addFilterBefore(preFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider provider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService.userDetailsService());
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(5);          // Số thread core luôn giữ
        executor.setMaxPoolSize(10);          // Số thread tối đa
        executor.setQueueCapacity(100);       // Queue để đợi nếu thread bận
        executor.setThreadNamePrefix("AsyncThread-");


        //Chạy luôn task trên thread gọi (main thread)
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
//        //(Mặc định) Ném RejectedExecutionException → task bị từ chối
//        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.AbortPolicy());
//        //Task bị vứt bỏ, không ghi log hay báo exception nào cả
//        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardPolicy());
//        //Xóa task cũ nhất trong queue, rồi thêm task mới vào
//        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());

        executor.initialize();
        return executor;
    }
}
