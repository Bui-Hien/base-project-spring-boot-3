package com.buihien.core.service;

import com.buihien.core.domain.security.User;
import com.buihien.core.dto.security.UserDto;

public interface UserPermissionService {
    void handleSetPermissionForUser(UserDto dto, User entity);
}
