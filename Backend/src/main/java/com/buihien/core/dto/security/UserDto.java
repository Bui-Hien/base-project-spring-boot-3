package com.buihien.core.dto.security;

import com.buihien.core.domain.security.GroupUser;
import com.buihien.core.domain.security.User;
import com.buihien.core.domain.security.UserRole;
import com.buihien.core.dto.AuditableDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Valid
public class UserDto extends AuditableDto {
    private LocalDateTime isAccountNonExpired;//Thời gian hết hạn của tài khoản
    private Boolean isAccountNonLocked;// true  -> account user có thể login
    private LocalDateTime isCredentialsNonExpired;//thời gian hợp lệ của pass ví dụ xx ngày không đăng nhập được
    private Boolean isEnabled;//active qua mail, true  -> account enabled, user có thể login
    private Boolean isActive;//sai mật khẩu nhiều lần khóa,  true  -> account enabled, user có thể login
    private LocalDateTime lastLoginTime; // Thời gian login gần nhất
    private Long totalLoginFailures; // Tổng số lần login thất bại
    private Long lastLoginFailures; // Số lần login thất bại gần nhất
    @NotBlank(message = "Đây là trường bắt buộc")
    private String username; // username dùng để login
    private String password;
    private String confirmPassword;
    private List<RoleDto> roles;
    private List<GroupDto> groups;
    private List<String> permissions;

    public UserDto() {
    }

    public UserDto(User entity) {
        super(entity);
        if (entity == null) return;
        this.isAccountNonExpired = entity.getIsAccountNonExpired();
        this.isAccountNonLocked = entity.getIsAccountNonLocked();
        this.isCredentialsNonExpired = entity.getIsCredentialsNonExpired();
        this.isEnabled = entity.getIsEnabled();
        this.isActive = entity.getIsActive();
        this.lastLoginTime = entity.getLastLoginTime();
        this.totalLoginFailures = entity.getTotalLoginFailures();
        this.lastLoginFailures = entity.getLastLoginFailures();
        this.username = entity.getUsername();
        if (entity.getAuthorities() != null && !entity.getAuthorities().isEmpty()) {
            this.permissions = new ArrayList<>();
            for (GrantedAuthority item : entity.getAuthorities()) {
                this.permissions.add(item.getAuthority());
            }
        }
    }

    public UserDto(User entity, Boolean isGetFull) {
        this(entity);
        if (Boolean.FALSE.equals(isGetFull)) return;
        if (entity.getRoles() != null && !entity.getRoles().isEmpty()) {
            this.roles = new ArrayList<>();
            for (UserRole role : entity.getRoles()) {
                this.roles.add(new RoleDto(role.getRole()));
            }
        }
        if (entity.getGroups() != null && !entity.getGroups().isEmpty()) {
            this.groups = new ArrayList<>();
            for (GroupUser group : entity.getGroups()) {
                this.groups.add(new GroupDto(group.getGroup()));
            }
        }
    }

    public String getPassword() {
        return this.password;
    }

    public String getUsername() {
        return this.username;
    }

    // ==================== Getters & Setters ====================

    public LocalDateTime getIsAccountNonExpired() {
        return isAccountNonExpired;
    }

    public void setIsAccountNonExpired(LocalDateTime isAccountNonExpired) {
        this.isAccountNonExpired = isAccountNonExpired;
    }

    public Boolean getIsAccountNonLocked() {
        return isAccountNonLocked;
    }

    public void setIsAccountNonLocked(Boolean isAccountNonLocked) {
        this.isAccountNonLocked = isAccountNonLocked;
    }

    public LocalDateTime getIsCredentialsNonExpired() {
        return isCredentialsNonExpired;
    }

    public void setIsCredentialsNonExpired(LocalDateTime isCredentialsNonExpired) {
        this.isCredentialsNonExpired = isCredentialsNonExpired;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(Boolean isEnabled) {
        this.isEnabled = isEnabled;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public Long getTotalLoginFailures() {
        return totalLoginFailures;
    }

    public void setTotalLoginFailures(Long totalLoginFailures) {
        this.totalLoginFailures = totalLoginFailures;
    }

    public Long getLastLoginFailures() {
        return lastLoginFailures;
    }

    public void setLastLoginFailures(Long lastLoginFailures) {
        this.lastLoginFailures = lastLoginFailures;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<RoleDto> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDto> roles) {
        this.roles = roles;
    }

    public List<GroupDto> getGroups() {
        return groups;
    }

    public void setGroups(List<GroupDto> groups) {
        this.groups = groups;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
