package com.buihien.core.repository;

import com.buihien.core.domain.security.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    @Query("""
                SELECT CASE WHEN COUNT(entity.id) > 0 THEN true ELSE false END
                FROM Permission entity
                WHERE entity.name = :name
                  AND entity.voided = false
                  AND (:excludeId IS NULL OR entity.id <> :excludeId)
            """)
    boolean existsByName(@Param("name") String name, @Param("excludeId") UUID excludeId);

    @Query("SELECT entity FROM Permission entity WHERE entity.voided = false AND entity.name = :name ")
    Optional<Permission> findByName(@Param("name") String name);
}
