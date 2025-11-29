package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;

@Entity
@Table(name = "tbl_role_permission", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"permission_id", "role_id"})
})
@SQLDelete(sql = "UPDATE tbl_role_permission SET voided = true WHERE id = ?")
public class RolePermission extends Auditable {
    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permission permission;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    public RolePermission() {
        super();
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
