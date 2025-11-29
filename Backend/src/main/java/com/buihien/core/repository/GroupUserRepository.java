package com.buihien.core.repository;

import com.buihien.core.domain.security.GroupUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GroupUserRepository extends JpaRepository<GroupUser, UUID> {
    @Query("SELECT entity FROM GroupUser entity WHERE entity.group.id = :groupId AND entity.user.id = :userId")
    GroupUser findByGroupAndUser(@Param("groupId") UUID groupId, @Param("userId") UUID userId);
}
