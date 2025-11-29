package com.buihien.core.dto.security;

import com.buihien.core.domain.security.Permission;
import com.buihien.core.dto.AuditableDto;

public class PermissionDto extends AuditableDto {
    private String name;
    private String description;

    public PermissionDto() {
    }

    public PermissionDto(Permission entity) {
        super(entity);
        if (entity == null) {
            return;
        }
        this.name = entity.getName();
        this.description = entity.getDescription();
    }

    // Getters & Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
