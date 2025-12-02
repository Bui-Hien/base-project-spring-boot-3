package com.buihien.core.dto.security;

import com.buihien.core.domain.security.GroupUser;
import com.buihien.core.domain.security.User;
import com.buihien.core.domain.security.UserPermission;
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
    private LocalDateTime accountNonExpired;//Thời gian hết hạn của tài khoản
    private Boolean isAccountNonLocked;// true  -> account user có thể login
    private LocalDateTime credentialsNonExpired;//thời gian hợp lệ của pass ví dụ xx ngày không đăng nhập được
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
    private List<PermissionDto> permissions;
    private List<String> authorities;

    public UserDto() {
    }

    public UserDto(User entity) {
        super(entity);
        if (entity == null) return;
        this.accountNonExpired = entity.getAccountNonExpired();
        this.isAccountNonLocked = entity.getIsAccountNonLocked();
        this.credentialsNonExpired = entity.getCredentialsNonExpired();
        this.isEnabled = entity.getIsEnabled();
        this.isActive = entity.getIsActive();
        this.lastLoginTime = entity.getLastLoginTime();
        this.totalLoginFailures = entity.getTotalLoginFailures();
        this.lastLoginFailures = entity.getLastLoginFailures();
        this.username = entity.getUsername();
        if (entity.getAuthorities() != null && !entity.getAuthorities().isEmpty()) {
            this.authorities = new ArrayList<>();
            for (GrantedAuthority authority : entity.getAuthorities()) {
                this.authorities.add(authority.getAuthority());
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
        if (entity.getPermissions() != null && !entity.getPermissions().isEmpty()) {
            this.permissions = new ArrayList<>();
            for (UserPermission permission : entity.getPermissions()) {
                this.permissions.add(new PermissionDto(permission.getPermission()));
            }
        }
    }

    public String getPassword() {
        return this.password;
    }

    public String getUsername() {
        return this.username;
    }

    public LocalDateTime getAccountNonExpired() {
        return accountNonExpired;
    }

    public void setAccountNonExpired(LocalDateTime accountNonExpired) {
        this.accountNonExpired = accountNonExpired;
    }

    public Boolean getIsAccountNonLocked() {
        return isAccountNonLocked;
    }

    public void setIsAccountNonLocked(Boolean isAccountNonLocked) {
        this.isAccountNonLocked = isAccountNonLocked;
    }

    public LocalDateTime getCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    public void setCredentialsNonExpired(LocalDateTime credentialsNonExpired) {
        this.credentialsNonExpired = credentialsNonExpired;
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

    public List<PermissionDto> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDto> permissions) {
        this.permissions = permissions;
    }

    public List<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(List<String> authorities) {
        this.authorities = authorities;
    }
}
