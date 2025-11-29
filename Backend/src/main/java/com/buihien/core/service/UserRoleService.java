package com.buihien.core.service;

import com.buihien.core.domain.security.User;
import com.buihien.core.dto.security.UserDto;

public interface UserRoleService {
    void handleSetRoleForUser(UserDto dto, User entity);
}
