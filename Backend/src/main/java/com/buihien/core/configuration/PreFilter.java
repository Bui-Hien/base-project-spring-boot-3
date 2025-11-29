package com.buihien.core.configuration;

import com.buihien.core.domain.security.UserToken;
import com.buihien.core.exception.UnauthorizedException;
import com.buihien.core.repository.UserTokenRepository;
import com.buihien.core.service.JwtService;
import com.buihien.core.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

import static com.buihien.core.CoreConstants.TokenType.ACCESS_TOKEN;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class PreFilter extends OncePerRequestFilter {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserTokenRepository userTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader(AUTHORIZATION);
        String tokenParam = request.getParameter("token");

        if (StringUtils.hasText(tokenParam)) {
            authorization = "Bearer " + tokenParam;
        }

        if (!StringUtils.hasText(authorization) || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authorization.substring("Bearer ".length());

        try {
            // Extract username từ token
            UserToken userToken = userTokenRepository.findByAccessToken(token, LocalDateTime.now()).orElseThrow(() ->
                    new UnauthorizedException("Không xác thực được người dùng.")
            );

            // Skip nếu đã authenticated trong request này
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            UserDetails userDetails = userService.userDetailsService().loadUserByUsername(userToken.getUsername());

            if (!jwtService.isValid(token, ACCESS_TOKEN.getValue(), userDetails)) {
                filterChain.doFilter(request, response);
                return;
            }

            this.setAuthentication(userDetails, request);

        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token", e);
            throw new UnauthorizedException("Phiên đăng nhập đã hết hạn.");

        } catch (Exception e) {
            logger.error("Unexpected error", e);
            throw new UnauthorizedException("Không xác thực được người dùng.");
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthentication(UserDetails userDetails, HttpServletRequest request) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }
}
