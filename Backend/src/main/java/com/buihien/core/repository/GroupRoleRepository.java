package com.buihien.core.repository;

import com.buihien.core.domain.security.GroupRole;
import com.buihien.core.domain.security.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupRoleRepository extends JpaRepository<GroupRole, UUID> {
    @Query("SELECT entity FROM GroupRole entity WHERE entity.group.id = :groupId AND entity.role.id = :roleId")
    GroupRole findByGroupAndRole(@Param("groupId") UUID groupId, @Param("roleId") UUID roleId);
}
