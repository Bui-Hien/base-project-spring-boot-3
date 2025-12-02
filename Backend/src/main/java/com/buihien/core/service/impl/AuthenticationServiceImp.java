package com.buihien.core.service.impl;

import com.buihien.core.domain.security.User;
import com.buihien.core.domain.security.UserToken;
import com.buihien.core.dto.auth.*;
import com.buihien.core.exception.ForbiddenException;
import com.buihien.core.exception.InvalidDataException;
import com.buihien.core.exception.NotFoundException;
import com.buihien.core.exception.UnauthorizedException;
import com.buihien.core.repository.UserRepository;
import com.buihien.core.repository.UserTokenRepository;
import com.buihien.core.service.AuthenticationService;
import com.buihien.core.service.JwtService;
import com.buihien.core.service.MailService;
import com.buihien.core.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

import static com.buihien.core.CoreConstants.TokenType.REFRESH_TOKEN;

@Service
public class AuthenticationServiceImp implements AuthenticationService {
    @Value("${jwt.expiryHour:1}")
    private long expiryHour;
    @Value("${jwt.expiryDay}")
    private long expiryRefreshTokenDay;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private MailService mailService;
    @Value("${maxFailedLoginAttempts:5}")
    private int maxFailedLoginAttempts;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserTokenRepository userTokenRepository;

    @Override
    public TokenResponseDto accessToken(SignInDto dto, HttpServletRequest request) {
        User user = userRepository.findByUsername(dto.getUsername()).orElse(null);
        if (user == null) {
            throw new NotFoundException("Người dùng không tồn tại trong hệ thống.");
        }

        if (Boolean.FALSE.equals(user.getIsEnabled())) {
            throw new ForbiddenException("Tài khoản của bạn chưa được kích hoạt.");
        }
        if (Boolean.TRUE.equals(user.getIsActive())) {
            throw new ForbiddenException("Tài khoản của bạn đã bị tạm khóa do đăng nhập sai quá nhiều lần.");
        }
        // Xác thực người dùng
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
            // Nếu xác thực thành công, tiếp tục tạo token
            String accessToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            user.setLastLoginFailures(null);
            user.setLastLoginTime(LocalDateTime.now());
            user = userRepository.save(user);

            UserToken userToken = new UserToken();
            userToken.setAccessToken(accessToken);
            userToken.setRefreshToken(refreshToken);
            userToken.setExpiredTime(LocalDateTime.now().plusDays(expiryRefreshTokenDay));
            userToken.setDeviceInfo(request.getHeader("User-Agent"));
            userToken.setIpAddress(getClientIp(request));
            userToken.setUser(user);
            userToken.setUsername(user.getUsername());
            userTokenRepository.save(userToken);

            return new TokenResponseDto(accessToken, refreshToken);
        } catch (BadCredentialsException ex) {
            long lastLoginFailures = (user.getLastLoginFailures() != null) ? user.getLastLoginFailures() + 1 : 1;
            long totalLoginFailures = (user.getTotalLoginFailures() != null) ? user.getTotalLoginFailures() + 1 : 1;

            user.setLastLoginFailures(lastLoginFailures);
            user.setTotalLoginFailures(totalLoginFailures);
            if (lastLoginFailures >= maxFailedLoginAttempts) {
                user.setIsActive(false);
            }
            userRepository.save(user);
            throw new InvalidDataException("Tên người dùng hoặc mật khẩu không chính xác");
        }
    }

    @Override
    public TokenResponseDto refreshToken(TokenResponseDto dto, HttpServletRequest request) {
        if (dto == null || !StringUtils.hasText(dto.getRefreshToken())) {
            throw new ForbiddenException("Phiên đăng nhập không hợp lệ.");
        }

        String refreshToken = dto.getRefreshToken().strip();

        // Validate token trước DB
        String username = jwtService.extractUsername(refreshToken, REFRESH_TOKEN.getValue());
        if (!StringUtils.hasText(username)) {
            throw new ForbiddenException("Phiên đăng nhập không hợp lệ.");
        }

        // Lấy User từ DB
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User không tồn tại"));

        // Check validity của token
        if (!jwtService.isValid(refreshToken, REFRESH_TOKEN.getValue(), user)) {
            throw new ForbiddenException("Phiên đăng nhập không hợp lệ.");
        }

        String accessToken = jwtService.generateToken(user);

        // Lấy UserToken từ DB
        UserToken userToken = userTokenRepository.findByRefreshToken(refreshToken, LocalDateTime.now())
                .orElseThrow(() -> new ForbiddenException("Phiên đăng nhập không hợp lệ."));

        userToken.setAccessToken(accessToken);
        userToken.setDeviceInfo(request.getHeader("User-Agent"));
        userToken.setIpAddress(getClientIp(request));
        userTokenRepository.save(userToken);

        dto.setAccessToken(accessToken);
        return dto;
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordDto dto, HttpServletRequest request) {
        if (dto == null || !StringUtils.hasText(dto.getUsername().strip())) {
            throw new InvalidDataException("Tên tài khoản đăng nhập không được để trống");
        }
        User user = userRepository.findByUsername(dto.getUsername().strip())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thông tin người dùng"));

        String resetToken = jwtService.generateResetToken(user);

        UserToken token = new UserToken();
        token.setUsername(user.getUsername());
        token.setUser(user);
        token.setResetToken(resetToken);
        token.setExpiredTime(LocalDateTime.now().plusHours(expiryHour));
        token.setDeviceInfo(request.getHeader("User-Agent"));
        token.setIpAddress(getClientIp(request));
        userTokenRepository.save(token);

        mailService.sendConfirmLink(user.getUsername(), user.getUsername(), resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordDto request) {
        UserToken userToken = userTokenRepository.findByResetToken(request.getSecretKey().strip(), LocalDateTime.now()).orElseThrow(() ->
                new InvalidDataException("Liên kết không hợp lệ")
        );

        // Giải mã username từ resetToken (JWT)
        User entity = userRepository.findByUsername(userToken.getUsername()).orElseThrow(() ->
                new NotFoundException("Không tìm thấy thông tin người dùng.")
        );
        // Check validity của token
        if (!jwtService.isValid(request.getSecretKey().strip(), REFRESH_TOKEN.getValue(), entity)) {
            throw new InvalidDataException("Liên kết không hợp lệ");
        }

        // Kiểm tra password khớp nhau
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidDataException("Mật khẩu mới và mật khẩu xác nhận không trùng khớp.");
        }
        //vo hien hoa token
        userToken.setRevoked(true);
        userTokenRepository.save(userToken);

        // Cập nhật mật khẩu
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        entity.setIsActive(true);
        entity.setLastLoginFailures(null);
        userRepository.save(entity);
    }

    @Override
    public void changePassword(ChangePasswordDto request) {
        User currentUser = userService.getCurrentUser();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(currentUser.getUsername(), request.getOldPassword()));
            // Kiểm tra password khớp nhau
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new InvalidDataException("Mật khẩu mới và mật khẩu xác nhận không trùng khớp.");
            }
            // Giải mã username từ resetToken (JWT)

            currentUser.setPassword(passwordEncoder.encode(request.getPassword()));
            currentUser.setIsActive(true);
            currentUser.setLastLoginFailures(null);
            userRepository.save(currentUser);
            mailService.sendChangePassword(currentUser.getUsername(), currentUser.getUsername(), true);
        } catch (BadCredentialsException ex) {
            long lastLoginFailures = (currentUser.getLastLoginFailures() != null) ? currentUser.getLastLoginFailures() + 1 : 1;
            long totalLoginFailures = (currentUser.getTotalLoginFailures() != null) ? currentUser.getTotalLoginFailures() + 1 : 1;

            currentUser.setLastLoginFailures(lastLoginFailures);
            currentUser.setTotalLoginFailures(totalLoginFailures);
            if (lastLoginFailures >= maxFailedLoginAttempts) {
                currentUser.setIsActive(false);
                throw new UnauthorizedException("Tài khoản người dùng đã bị khóa");
            }
            userRepository.save(currentUser);
            mailService.sendChangePassword(currentUser.getUsername(), currentUser.getUsername(), false);

            throw new InvalidDataException("Mật khẩu cũ chính xác");
        }
    }

    @Override
    public void removeToken(TokenResponseDto dto, HttpServletRequest request) {
        if (dto == null || !StringUtils.hasText(dto.getRefreshToken())) {
            throw new ForbiddenException("Phiên đăng nhập không hợp lệ.");
        }

        String refreshToken = dto.getRefreshToken().trim();

        UserToken userToken = userTokenRepository
                .findByRefreshToken(refreshToken, LocalDateTime.now())
                .orElseThrow(() ->
                        new ForbiddenException("Phiên đăng nhập không hợp lệ.")
                );

        userToken.setDeviceInfo(request.getHeader("User-Agent"));
        userToken.setIpAddress(getClientIp(request));

        userToken.setRevoked(Boolean.TRUE);
        userToken.setRevokedTime(LocalDateTime.now());

        userTokenRepository.save(userToken);
    }


    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            return ip.split(",")[0];
        }
        ip = request.getHeader("X-Real-IP");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }
        return request.getRemoteAddr();
    }
}
