package com.buihien.core.service;

import com.buihien.core.domain.security.Role;
import com.buihien.core.dto.security.RoleDto;

public interface RolePermissionService {
    void handleSetPermissionForRole(RoleDto dto, Role entity);
}
