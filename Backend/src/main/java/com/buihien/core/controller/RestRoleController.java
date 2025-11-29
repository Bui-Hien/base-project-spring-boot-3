package com.buihien.core.controller;

import com.buihien.core.dto.security.RoleDto;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequestMapping("/api/role")
@RestController
@Validated
public class RestRoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/save-or-update")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).ROLE_WRITE)")
    public ResponseData<RoleDto> saveOrUpdate(@Valid @RequestBody RoleDto dto) {
        RoleDto response = roleService.saveOrUpdate(dto);
        return new ResponseData<>(dto.getId() == null ? HttpStatus.CREATED.value() : HttpStatus.ACCEPTED.value(), dto.getId() == null ? "Thêm mới quyền thành công" : "Chỉnh sửa bản quyền thành công", response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).ROLE_DELETE)")
    public ResponseData<Void> deleteById(@PathVariable UUID id) {
        roleService.deleteById(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa quyền thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).ROLE_VIEW)")
    public ResponseData<RoleDto> getById(@PathVariable UUID id) {
        RoleDto response = roleService.getById(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy quyền thành công", response);
    }

    @PostMapping("/paging-search")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).ROLE_VIEW)")
    public ResponseData<Page<RoleDto>> pagingSearch(@Valid @RequestBody SearchDto dto) {
        Page<RoleDto> result = roleService.pagingSearch(dto);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách quyền thành công", result);
    }
}
