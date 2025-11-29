package com.buihien.core.controller;

import com.buihien.core.dto.search.UserSearchDto;
import com.buihien.core.dto.security.UserDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@Validated
public class RestUserController {
    @Autowired
    private UserService userService;

    @GetMapping("/get-current-user")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).USER_VIEW)")
    public ResponseData<UserDto> getCurrentUser() {
        UserDto result = userService.getCurrentUserDto();
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy thông tin người dùng hiện tại thành công", result);
    }

    @PostMapping("/save-or-update")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).USER_WRITE)")
    public ResponseData<UserDto> saveOrUpdate(@Valid @RequestBody UserDto dto) {
        UserDto response = userService.saveOrUpdate(dto);
        return new ResponseData<>(dto.getId() == null ? HttpStatus.CREATED.value() : HttpStatus.ACCEPTED.value(), dto.getId() == null ? "Thêm mới người dùng thành công" : "Chỉnh sửa bản người dùng thành công", response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).USER_DELETE)")
    public ResponseData<Void> deleteById(@PathVariable UUID id) {
        userService.deleteById(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa người dùng thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).USER_VIEW)")
    public ResponseData<UserDto> getById(@PathVariable UUID id) {
        UserDto response = userService.getById(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy người dùng thành công", response);
    }

    @PostMapping("/paging-search")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).USER_VIEW)")
    public ResponseData<Page<UserDto>> pagingSearch(@Valid @RequestBody UserSearchDto dto) {
        Page<UserDto> result = userService.pagingSearch(dto);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách người dùng thành công", result);
    }
}