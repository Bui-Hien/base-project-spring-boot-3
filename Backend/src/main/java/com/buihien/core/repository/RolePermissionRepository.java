package com.buihien.core.repository;

import com.buihien.core.domain.security.RolePermission;
import com.buihien.core.domain.security.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, UUID> {
    @Query("SELECT entity FROM RolePermission entity WHERE entity.permission.id = :permissionId AND entity.role.id = :roleId")
    RolePermission findByRoleAndPermission(@Param("roleId") UUID roleId, @Param("permissionId") UUID permissionId);
}
