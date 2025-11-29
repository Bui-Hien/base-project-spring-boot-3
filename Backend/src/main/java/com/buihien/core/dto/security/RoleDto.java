package com.buihien.core.dto.security;

import com.buihien.core.domain.security.Role;
import com.buihien.core.domain.security.RolePermission;
import com.buihien.core.dto.AuditableDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Valid
public class RoleDto extends AuditableDto {
    @NotBlank(message = "Đây là trường bắt buộc")
    private String name;
    private String description;
    private List<PermissionDto> permissions;

    public RoleDto() {
    }

    public RoleDto(Role entity) {
        super(entity);
        if (entity == null) return;
        this.name = entity.getName();
        this.description = entity.getDescription();
    }

    public RoleDto(Role entity, Boolean isGetFull) {
        this(entity);
        if (Boolean.FALSE.equals(isGetFull)) {
            return;
        }
        if (entity.getPermissions() != null && !entity.getPermissions().isEmpty()) {
            this.permissions = new ArrayList<>();
            for (RolePermission permission : entity.getPermissions()) {
                this.permissions.add(new PermissionDto(permission.getPermission()));
            }
        }
    }

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

    public List<PermissionDto> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDto> permissions) {
        this.permissions = permissions;
    }
}
