package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Permission;
import com.buihien.core.domain.security.User;
import com.buihien.core.domain.security.UserPermission;
import com.buihien.core.dto.security.PermissionDto;
import com.buihien.core.dto.security.UserDto;
import com.buihien.core.repository.PermissionRepository;
import com.buihien.core.repository.UserPermissionRepository;
import com.buihien.core.service.UserPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class UserPermissionServiceImpl implements UserPermissionService {
    @Autowired
    private UserPermissionRepository userPermissionRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public void handleSetPermissionForUser(UserDto dto, User entity) {
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
            UserPermission userPermission = userPermissionRepository.findByPermissionAndUser(permission.getId(), entity.getId());
            if (userPermission == null) {
                userPermission = new UserPermission();
            }
            userPermission.setUser(entity);
            userPermission.setPermission(permission);
            userPermission.setVoided(false);

            entity.getPermissions().add(userPermission);
        }
    }
}
