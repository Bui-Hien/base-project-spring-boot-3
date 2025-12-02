package com.buihien.core.controller;

import com.buihien.core.dto.SystemConfigDto;
import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.SystemConfigService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/system-config")
@RestController
@Validated
public class RestSystemConfigController {
    @Autowired
    private SystemConfigService systemConfigService;

    @PostMapping("/save-or-update")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_CONFIG_WRITE)")
    public ResponseData<SystemConfigDto> saveOrUpdate(@Valid @RequestBody SystemConfigDto dto) {
        SystemConfigDto response = systemConfigService.saveOrUpdate(dto);
        return new ResponseData<>(dto.getId() == null ? HttpStatus.CREATED.value() : HttpStatus.ACCEPTED.value(), dto.getId() == null ? "Thêm mới cấu hình hệ thống thành công" : "Chỉnh sửa bản cấu hình hệ thống thành công", response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_CONFIG_VIEW)")
    public ResponseData<SystemConfigDto> getById(@PathVariable UUID id) {
        SystemConfigDto response = systemConfigService.getById(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy cấu hình hệ thống thành công", response);
    }

    @PostMapping("/paging-search")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).SYSTEM_CONFIG_VIEW)")
    public ResponseData<Page<SystemConfigDto>> pagingSearch(@Valid @RequestBody SearchDto dto) {
        Page<SystemConfigDto> result = systemConfigService.pagingSearch(dto);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách cấu hình hệ thống thành công", result);
    }

    @GetMapping("/public/all")
    public ResponseData<List<SystemConfigDto>> getAllSystemConfig() {
        List<SystemConfigDto> result = systemConfigService.getAllSystemConfig();
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy thông tin cấu hình hệ thống thành côngo", result);
    }
}