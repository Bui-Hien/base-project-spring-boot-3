package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Set;

@Table(name = "tbl_role",
        indexes = {
                @Index(name = "idx_role_name_voided", columnList = "name, voided")
        })
@Entity
@SQLDelete(sql = "UPDATE tbl_role SET voided = true WHERE id = ?")
public class Role extends Auditable {

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    @Where(clause = "voided = false")
    @OrderBy("createdAt")
    private Set<RolePermission> permissions;

    public Role() {
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

    public Set<RolePermission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<RolePermission> permissions) {
        this.permissions = permissions;
    }
}
