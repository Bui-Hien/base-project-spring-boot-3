package com.buihien.core.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;

/**
 * Entity lưu trữ cấu hình hệ thống dưới dạng key-value.
 * Có thể dùng để lưu setting động (e.g. tỷ lệ hoa hồng, max login attempts...).
 *
 * @author buixuanhienmy@gmail.com
 */
@Entity
@Table(name = "tbl_system_config",
        indexes = {
                @Index(name = "idx_system_config_key_voided", columnList = "config_key, voided")
        })
@SQLDelete(sql = "UPDATE tbl_system_config SET voided = true WHERE id = ?")
public class SystemConfig extends Auditable {

    @Column(name = "config_key", nullable = false, unique = true)
    private String key;  // tên cấu hình

    @Column(name = "type")
    private Integer type; // ValueType

    @Column(name = "config_value")
    private String value; // giá trị

    @Column(name = "description")
    private String description; // mô tả cấu hình

    public SystemConfig() {
        super();
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
