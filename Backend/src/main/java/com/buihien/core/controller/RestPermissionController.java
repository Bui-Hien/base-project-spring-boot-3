package com.buihien.core.controller;

import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.dto.security.PermissionDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.PermissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/permission")
@RestController
@Validated
public class RestPermissionController {
    @Autowired
    private PermissionService permissionService;

    @PostMapping("/paging-search")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).GROUP_VIEW)")
    public ResponseData<Page<PermissionDto>> pagingSearch(@Valid @RequestBody SearchDto dto) {
        Page<PermissionDto> result = permissionService.pagingSearch(dto);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách quền hạn thành công", result);
    }
}
