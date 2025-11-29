package com.buihien.core.dto;

import com.buihien.core.domain.FileDescription;
import jakarta.validation.Valid;

@Valid
public class FileDescriptionDto extends AuditableDto {
    private String contentType;
    private Long contentSize;
    private String name;
    private String extension;
    private String filePath;
    private Boolean isPending;

    public FileDescriptionDto() {
    }

    public FileDescriptionDto(FileDescription entity) {
        super(entity);
        if (entity == null) return;
        this.contentType = entity.getContentType();
        this.contentSize = entity.getContentSize();
        this.name = entity.getName();
        this.extension = entity.getExtension();
        this.filePath = entity.getFilePath();
    }


    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getContentSize() {
        return contentSize;
    }

    public void setContentSize(Long contentSize) {
        this.contentSize = contentSize;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Boolean getIsPending() {
        return isPending;
    }

    public void setIsPending(Boolean pending) {
        isPending = pending;
    }
}
