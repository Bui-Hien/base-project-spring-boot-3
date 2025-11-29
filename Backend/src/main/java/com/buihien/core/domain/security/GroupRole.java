package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;

@Entity
@Table(name = "tbl_group_role", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"group_id", "role_id"})
})
@SQLDelete(sql = "UPDATE tbl_group_role SET voided = true WHERE id = ?")
public class GroupRole extends Auditable {
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    public GroupRole() {
        super();
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
