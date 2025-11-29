package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLDelete;

@Table(name = "tbl_permission",
        indexes = {
                @Index(name = "idx_permission_name_voided", columnList = "name, voided")
        })
@Entity
@SQLDelete(sql = "UPDATE tbl_permission SET voided = true WHERE id = ?")
public class Permission extends Auditable {

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    public Permission() {
        super();
    }

    // Getters & Setters
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
