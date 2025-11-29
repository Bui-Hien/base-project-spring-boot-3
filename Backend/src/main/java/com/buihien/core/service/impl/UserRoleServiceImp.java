package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Role;
import com.buihien.core.domain.security.User;
import com.buihien.core.domain.security.UserRole;
import com.buihien.core.dto.security.RoleDto;
import com.buihien.core.dto.security.UserDto;
import com.buihien.core.repository.RoleRepository;
import com.buihien.core.repository.UserRoleRepository;
import com.buihien.core.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class UserRoleServiceImp implements UserRoleService {
    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void handleSetRoleForUser(UserDto dto, User entity) {
        if (entity == null || entity.getId() == null) {
            return;
        }
        if (entity.getRoles() == null) {
            entity.setRoles(new HashSet<>());
        }
        entity.getRoles().clear();

        if (dto.getRoles() == null || dto.getRoles().isEmpty()) {
            return;
        }
        for (RoleDto item : dto.getRoles()) {
            if (item == null || item.getId() == null) {
                continue;
            }

            Role role = roleRepository.findById(item.getId()).orElse(null);
            if (role == null) {
                continue;
            }
            UserRole userRole = userRoleRepository.findByUserAndRole(entity.getId(), role.getId());
            if (userRole == null) {
                userRole = new UserRole();
            }
            userRole.setUser(entity);
            userRole.setRole(role);
            userRole.setVoided(false);

            entity.getRoles().add(userRole);
        }
    }
}
