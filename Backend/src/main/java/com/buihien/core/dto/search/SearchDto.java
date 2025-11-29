package com.buihien.core.dto.search;

import com.buihien.core.util.DateTimeUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.UUID;

@Valid
public class SearchDto {
    public UUID id;
    public UUID ownerId;
    @Min(value = 1, message = "pageIndex phải lớn hơn hoặc bằng 1")
    public Integer pageIndex;
    @Min(value = 1, message = "pageSize phải lớn hơn hoặc bằng 1")
    @Max(value = 500, message = "pageSize không được vượt quá 500")
    public Integer pageSize;
    public String keyword;
    public LocalDateTime fromDate;
    public LocalDateTime toDate;
    public Boolean voided;
    public Boolean orderBy; //mặc định là DESC của trường createdAt
    public UUID roleId;
    public UUID parentId;
    public Boolean exportExcel;
    public LocalDateTime date;

    public SearchDto() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getKeyword() {
        if (this.keyword == null || !StringUtils.hasText(this.keyword.strip())) {
            return null;
        }
        return keyword.strip();
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public LocalDateTime getFromDate() {
        if (fromDate == null) {
            return null;
        }
        return DateTimeUtil.getStartOfDay(fromDate);
    }

    public void setFromDate(LocalDateTime fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDateTime getToDate() {
        if (toDate == null) {
            return null;
        }
        return DateTimeUtil.getEndOfDay(toDate);
    }

    public void setToDate(LocalDateTime toDate) {
        this.toDate = toDate;
    }

    public Boolean getVoided() {
        return voided;
    }

    public void setVoided(Boolean voided) {
        this.voided = voided;
    }

    public UUID getRoleId() {
        return roleId;
    }

    public void setRoleId(UUID roleId) {
        this.roleId = roleId;
    }

    public Boolean getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(Boolean orderBy) {
        this.orderBy = orderBy;
    }

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

    public Boolean getExportExcel() {
        return exportExcel;
    }

    public void setExportExcel(Boolean exportExcel) {
        this.exportExcel = exportExcel;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
