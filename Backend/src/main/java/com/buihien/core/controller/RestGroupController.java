package com.buihien.core.controller;

import com.buihien.core.dto.search.SearchDto;
import com.buihien.core.dto.security.GroupDto;
import com.buihien.core.generic.ResponseData;
import com.buihien.core.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequestMapping("/api/group")
@RestController
@Validated
public class RestGroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping("/save-or-update")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).GROUP_WRITE)")
    public ResponseData<GroupDto> saveOrUpdate(@Valid @RequestBody GroupDto dto) {
        GroupDto response = groupService.saveOrUpdate(dto);
        return new ResponseData<>(dto.getId() == null ? HttpStatus.CREATED.value() : HttpStatus.ACCEPTED.value(), dto.getId() == null ? "Thêm mới nhóm quyên thành công" : "Chỉnh sửa bản nhóm quyên thành công", response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).GROUP_DELETE)")
    public ResponseData<Void> deleteById(@PathVariable UUID id) {
        groupService.deleteById(id);
        return new ResponseData<>(HttpStatus.NO_CONTENT.value(), "Xóa nhóm quyên thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).GROUP_VIEW)")
    public ResponseData<GroupDto> getById(@PathVariable UUID id) {
        GroupDto response = groupService.getById(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy nhóm quyên thành công", response);
    }

    @PostMapping("/paging-search")
    @PreAuthorize("hasAuthority(T(com.buihien.core.CoreConstants).ROLE_SYSTEM_ADMIN) or hasAuthority(T(com.buihien.core.CoreConstants).GROUP_VIEW)")
    public ResponseData<Page<GroupDto>> pagingSearch(@Valid @RequestBody SearchDto dto) {
        Page<GroupDto> result = groupService.pagingSearch(dto);
        return new ResponseData<>(HttpStatus.OK.value(), "Lấy danh sách nhóm quyên thành công", result);
    }
}
