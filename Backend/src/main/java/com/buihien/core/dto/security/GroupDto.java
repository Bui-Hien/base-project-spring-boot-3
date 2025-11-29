
package com.buihien.core.dto.security;

import com.buihien.core.domain.security.Group;
import com.buihien.core.domain.security.GroupRole;
import com.buihien.core.dto.AuditableDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Valid
public class GroupDto extends AuditableDto {
    @NotBlank(message = "Đây là trường bắt buộc")
    private String name;
    private String description;
    private List<RoleDto> roles;

    public GroupDto() {
    }

    public GroupDto(Group entity) {
        super(entity);
        if (entity == null) return;
        this.name = entity.getName();
        this.description = entity.getDescription();
    }

    public GroupDto(Group entity, Boolean isGetFull) {
        this(entity);
        if (Boolean.FALSE.equals(isGetFull)) return;
        if (entity.getRoles() != null && !entity.getRoles().isEmpty()) {
            this.roles = new ArrayList<>();
            for (GroupRole role : entity.getRoles()) {
                this.roles.add(new RoleDto(role.getRole()));
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

    public List<RoleDto> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDto> roles) {
        this.roles = roles;
    }
}
