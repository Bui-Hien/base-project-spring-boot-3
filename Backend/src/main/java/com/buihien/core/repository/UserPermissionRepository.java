package com.buihien.core.repository;

import com.buihien.core.domain.security.GroupUser;
import com.buihien.core.domain.security.UserPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, UUID> {
    @Query("SELECT entity FROM UserPermission entity WHERE entity.permission.id = :permissionId AND entity.user.id = :userId")
    UserPermission findByPermissionAndUser(@Param("permissionId") UUID permissionId, @Param("userId") UUID userId);
}
