package com.buihien.core.repository;

import com.buihien.core.domain.SystemConfig;
import com.buihien.core.dto.SystemConfigDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, UUID> {
    @Query("SELECT entity FROM SystemConfig entity WHERE entity.key = :key AND entity.voided = false ")
    Optional<SystemConfig> findByKey(@Param("key") String key);

    @Query("SELECT new com.buihien.core.dto.SystemConfigDto(entity) FROM SystemConfig entity WHERE entity.voided = false ")
    List<SystemConfigDto> getAllSystemConfig();
}
