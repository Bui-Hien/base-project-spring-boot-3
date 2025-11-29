package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Permission;
import com.buihien.core.domain.security.Role;
import com.buihien.core.domain.security.RolePermission;
import com.buihien.core.dto.security.PermissionDto;
import com.buihien.core.dto.security.RoleDto;
import com.buihien.core.repository.PermissionRepository;
import com.buihien.core.repository.RolePermissionRepository;
import com.buihien.core.service.RolePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class RolePermissionServiceImpl implements RolePermissionService {
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Override
    public void handleSetPermissionForRole(RoleDto dto, Role entity) {
        if (entity == null || entity.getId() == null) {
            return;
        }
        if (entity.getPermissions() == null) {
            entity.setPermissions(new HashSet<>());
        }
        entity.getPermissions().clear();

        if (dto.getPermissions() == null || dto.getPermissions().isEmpty()) {
            return;
        }
        for (PermissionDto item : dto.getPermissions()) {
            if (item == null || item.getId() == null) {
                continue;
            }

            Permission permission = permissionRepository.findById(item.getId()).orElse(null);
            if (permission == null) {
                continue;
            }
            RolePermission rolePermission = rolePermissionRepository.findByRoleAndPermission(entity.getId(), permission.getId());
            if (rolePermission == null) {
                rolePermission = new RolePermission();
            }
            rolePermission.setPermission(permission);
            rolePermission.setRole(entity);
            rolePermission.setVoided(false);

            entity.getPermissions().add(rolePermission);
        }
    }
}
