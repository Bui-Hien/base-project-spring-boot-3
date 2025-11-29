package com.buihien.core.dto;

import com.buihien.core.domain.BaseObject;

public class BaseObjectDto extends AuditableDto {
    private String code;
    private String name;
    private String description;

    public BaseObjectDto() {
    }

    public BaseObjectDto(BaseObject entity) {
        super(entity);
        if (entity == null) return;
        this.code = entity.getCode();
        this.name = entity.getName();
        this.description = entity.getDescription();
    }

    public String getCode() {
        if (code == null) return "";
        return code.strip();
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
