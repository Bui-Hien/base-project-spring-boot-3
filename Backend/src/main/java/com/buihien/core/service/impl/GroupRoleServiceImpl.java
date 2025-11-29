package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Group;
import com.buihien.core.domain.security.GroupRole;
import com.buihien.core.domain.security.Role;
import com.buihien.core.domain.security.RolePermission;
import com.buihien.core.dto.security.GroupDto;
import com.buihien.core.dto.security.RoleDto;
import com.buihien.core.repository.GroupRoleRepository;
import com.buihien.core.repository.RoleRepository;
import com.buihien.core.service.GroupRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class GroupRoleServiceImpl implements GroupRoleService {
    @Autowired
    private GroupRoleRepository groupRoleRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void handleSetRoleForGroup(GroupDto dto, Group entity) {
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
            GroupRole groupRole = groupRoleRepository.findByGroupAndRole(entity.getId(), role.getId());
            if (groupRole == null) {
                groupRole = new GroupRole();
            }
            groupRole.setRole(role);
            groupRole.setGroup(entity);
            groupRole.setVoided(false);

            entity.getRoles().add(groupRole);
        }
    }
}
