package com.buihien.core.service.impl;

import com.buihien.core.domain.security.Group;
import com.buihien.core.domain.security.GroupUser;
import com.buihien.core.domain.security.User;
import com.buihien.core.dto.security.GroupDto;
import com.buihien.core.dto.security.UserDto;
import com.buihien.core.repository.GroupRepository;
import com.buihien.core.repository.GroupUserRepository;
import com.buihien.core.service.GroupUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class GroupUserServiceImpl implements GroupUserService {
    @Autowired
    private GroupUserRepository groupUserRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Override
    public void handleSetGroupForUser(UserDto dto, User entity) {
        if (entity == null || entity.getId() == null) {
            return;
        }
        if (entity.getGroups() == null) {
            entity.setGroups(new HashSet<>());
        }
        entity.getGroups().clear();

        if (dto.getGroups() == null || dto.getGroups().isEmpty()) {
            return;
        }
        for (GroupDto item : dto.getGroups()) {
            if (item == null || item.getId() == null) {
                continue;
            }

            Group group = groupRepository.findById(item.getId()).orElse(null);
            if (group == null) {
                continue;
            }
            GroupUser groupUser = groupUserRepository.findByGroupAndUser(group.getId(), entity.getId());
            if (groupUser == null) {
                groupUser = new GroupUser();
            }
            groupUser.setUser(entity);
            groupUser.setGroup(group);
            groupUser.setVoided(false);

            entity.getGroups().add(groupUser);
        }
    }
}
