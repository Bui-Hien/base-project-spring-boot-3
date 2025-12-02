package com.buihien.core.repository;

import com.buihien.core.domain.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Query(value = """
            (
                SELECT DISTINCT p.name
                FROM tbl_user u
                LEFT JOIN tbl_user_permission up 
                    ON up.user_id = u.id AND up.voided = false
                LEFT JOIN tbl_permission p 
                    ON p.id = up.permission_id AND p.voided = false
                WHERE u.voided = false AND u.username = :username
            )
            UNION ALL
            (
                SELECT DISTINCT p.name
                FROM tbl_user u
                LEFT JOIN tbl_user_role ur 
                    ON ur.user_id = u.id AND ur.voided = false
                LEFT JOIN tbl_role r 
                    ON r.id = ur.role_id AND r.voided = false
                LEFT JOIN tbl_role_permission rp 
                    ON rp.role_id = r.id AND rp.voided = false
                LEFT JOIN tbl_permission p 
                    ON p.id = rp.permission_id AND p.voided = false
                WHERE u.voided = false AND u.username = :username
            )
            UNION ALL
            (
                SELECT DISTINCT p.name
                FROM tbl_user u
                LEFT JOIN tbl_group_user gu 
                    ON gu.user_id = u.id AND gu.voided = false
                LEFT JOIN tbl_group g 
                    ON g.id = gu.group_id AND g.voided = false
                LEFT JOIN tbl_group_role gr 
                    ON gr.group_id = g.id AND gr.voided = false
                LEFT JOIN tbl_role r 
                    ON r.id = gr.role_id AND r.voided = false
                LEFT JOIN tbl_role_permission rp 
                    ON rp.role_id = r.id AND rp.voided = false
                LEFT JOIN tbl_permission p 
                    ON p.id = rp.permission_id AND p.voided = false
                WHERE u.voided = false AND u.username = :username
            )
            """, nativeQuery = true)
    Set<String> findAllPermissionsNative(@Param("username") String username);

    @Query("SELECT u FROM User u WHERE u.username = :username AND u.voided = false")
    Optional<User> findByUsername(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u " +
            "WHERE LOWER(u.username) = LOWER(:username) " +
            "AND u.voided = false " +
            "AND (:userId IS NULL OR u.id != :userId)")
    boolean existsByUsername(@Param("username") String username, @Param("userId") UUID userId);

    @Query("""
            SELECT DISTINCT u.username FROM User u
            JOIN u.roles ur
            WHERE ur.role.id = :roleId
            AND u.voided = false
            AND ur.voided = false
            """)
    Set<String> findUserNamesByRoleId(@Param("roleId") UUID roleId);

    @Query("""
            SELECT DISTINCT u.username FROM User u
            JOIN u.roles ur
            WHERE ur.role.id IN :roleIds
            AND u.voided = false
            AND ur.voided = false
            """)
    Set<String> findUserNamesByRoleIds(@Param("roleIds") List<UUID> roleIds);

    @Query("""
            SELECT DISTINCT u.username FROM User u
            JOIN u.groups gu
            WHERE gu.group.id = :groupId
            AND u.voided = false
            AND gu.voided = false
            """)
    Set<String> findUserNamesByGroupId(@Param("groupId") UUID groupId);

    @Query("""
            SELECT DISTINCT u.username FROM User u
            JOIN u.groups gu
            WHERE gu.group.id IN :groupIds
            AND u.voided = false
            AND gu.voided = false
            """)
    Set<String> findUserNamesByGroupIds(@Param("groupIds") List<UUID> groupIds);

    @Query("SELECT u.username FROM User u WHERE u.id = :id AND u.voided = false")
    Optional<String> findUseNameById(@Param("id") UUID id);

    @Query("SELECT u.username FROM User u WHERE u.id IN :ids AND u.voided = false")
    Optional<List<String>> findUseNamesByIds(@Param("ids") List<UUID> ids);

    @Query("""
            SELECT COUNT(up) FROM UserPermission up
            JOIN up.permission p
            WHERE p.name = :permissionName
            AND up.voided = false
            AND p.voided = false
            """)
    long countUserByPermission(@Param("permissionName") String permissionName);

    @Query("""
            SELECT COUNT(up) FROM UserPermission up
            JOIN up.permission p
            JOIN up.user u
            WHERE p.voided = false
              AND u.voided = false
              AND up.voided = false
              AND p.name = :permissionName
              AND u.username = :username
            """)
    long countUserByPermissionUserName(@Param("permissionName") String permissionName, @Param("username") String username);
}
