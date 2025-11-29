package com.buihien.core.repository;

import com.buihien.core.domain.security.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, UUID> {

    @Query("select entity from UserToken entity where entity.refreshToken = ?1 and entity.revoked = false and entity.expiredTime >= ?2 and entity.voided = false ")
    Optional<UserToken> findByRefreshToken(String refreshToken, LocalDateTime expiredTime);

    @Query("select entity from UserToken entity where entity.accessToken = ?1 and entity.revoked = false and entity.expiredTime >= ?2 and entity.voided = false ")
    Optional<UserToken> findByAccessToken(String accessToken, LocalDateTime expiredTime);

    @Query("select entity from UserToken entity where entity.resetToken = ?1 and entity.revoked = false and entity.expiredTime >= ?2 and entity.voided = false ")
    Optional<UserToken> findByResetToken(String resetToken, LocalDateTime expiredTime);

    @Query("select entity from UserToken entity where entity.user.id = ?1 and entity.revoked = false and entity.voided = false ")
    List<UserToken> findActiveTokensByUser(UUID userId);
}
