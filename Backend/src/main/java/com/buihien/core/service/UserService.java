package com.buihien.core.service;

import com.buihien.core.domain.security.User;
import com.buihien.core.dto.search.UserSearchDto;
import com.buihien.core.dto.security.UserDto;
import com.buihien.core.generic.GenericService;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends GenericService<UserDto, UserSearchDto> {
    UserDto getByUsername(String username);

    UserDetailsService userDetailsService();

    UserDto getCurrentUserDtoNonException();

    UserDto getCurrentUserDto();

    User getCurrentUserNonException();

    User getCurrentUser();

    List<String> getCurrentUserPermissions();
}
