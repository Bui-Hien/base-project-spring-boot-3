package com.buihien.core.service;

import com.buihien.core.domain.security.User;
import com.buihien.core.dto.security.UserDto;

public interface GroupUserService {
    void handleSetGroupForUser(UserDto dto, User entity);
}
