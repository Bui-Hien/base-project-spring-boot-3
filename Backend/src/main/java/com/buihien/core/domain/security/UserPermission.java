
package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;

@Entity
@Table(name = "tbl_user_permission", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "permission_id"})
})
@SQLDelete(sql = "UPDATE tbl_user_permission SET voided = true WHERE id = ?")
public class UserPermission extends Auditable {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "permission_id")
    private Permission permission;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }
}
