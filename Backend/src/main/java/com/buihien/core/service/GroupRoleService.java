package com.buihien.core.service;

import com.buihien.core.domain.security.Group;
import com.buihien.core.dto.security.GroupDto;

public interface GroupRoleService {
    void handleSetRoleForGroup(GroupDto dto, Group entity);
}
