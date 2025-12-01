package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Set;

@Table(name = "tbl_group",
        indexes = {
                @Index(name = "idx_group_name_voided", columnList = "name, voided")
        })
@Entity
@SQLDelete(sql = "UPDATE tbl_group SET voided = true WHERE id = ?")
public class Group extends Auditable {

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    @Where(clause = "voided = false")
    @OrderBy("createdAt")
    private Set<GroupRole> roles;

    public Group() {
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

    public Set<GroupRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<GroupRole> roles) {
        this.roles = roles;
    }
}
