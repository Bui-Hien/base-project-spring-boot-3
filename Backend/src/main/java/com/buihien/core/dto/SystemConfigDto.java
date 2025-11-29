package com.buihien.core.dto;

import com.buihien.core.domain.SystemConfig;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Valid
public class SystemConfigDto extends AuditableDto {
    private String key;  // tên cấu hình
    private Integer type; // ValueType
    @NotBlank(message = "Giá trị không được để trống")
    @Size(max = 100, message = "Giá trị không vượt quá 100 ký tự")
    private String value; // giá trị
    private String description; // mô tả cấu hình

    public SystemConfigDto() {
    }

    public SystemConfigDto(SystemConfig entity) {
        super(entity);
        if (entity == null) return;
        this.key = entity.getKey();
        this.type = entity.getType();
        this.value = entity.getValue();
        this.description = entity.getDescription();
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
