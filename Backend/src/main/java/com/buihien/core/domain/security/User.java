package com.buihien.core.domain.security;

import com.buihien.core.domain.Auditable;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;

@Table(name = "tbl_user",
        indexes = {
                @Index(name = "idx_user_username_voided", columnList = "username, voided"),
        })
@Entity
@SQLDelete(sql = "UPDATE tbl_user SET voided = true WHERE id = ?")
public class User extends Auditable implements UserDetails {
    @Column(name = "is_account_non_expired")
    private LocalDateTime isAccountNonExpired;

    @Column(name = "is_account_non_locked")
    private Boolean isAccountNonLocked = Boolean.TRUE;

    @Column(name = "is_credentials_non_expired")
    private LocalDateTime isCredentialsNonExpired;

    @Column(name = "is_enabled")
    private Boolean isEnabled = Boolean.FALSE;//active qua mail, true  -> account enabled, user có thể login

    @Column(name = "is_active")
    private Boolean isActive = Boolean.TRUE;//sai mật khẩu nhiều lần khóa,  true  -> account enabled, user có thể login

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime; // Thời gian login gần nhất

    @Column(name = "total_login_failures")
    private Long totalLoginFailures = 0L; // Tổng số lần login thất bại

    @Column(name = "last_login_failures")
    private Long lastLoginFailures = 0L; // Số lần login thất bại gần nhất

    @Column(name = "username", nullable = false)
    private String username; // username dùng để login

    @Column(name = "password", nullable = false)
    private String password; // password đã hash

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Where(clause = "voided = false")
    private Set<UserRole> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Where(clause = "voided = false")
    private Set<GroupUser> groups;

    public User() {
        super();
    }

    // ==================== UserDetails Methods ====================

    @Transient
    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Kiểm tra xem account có expired hay chưa
        // Logic:
        // - Nếu isAccountNonExpired == null → mặc định account chưa expired → return true
        // - Nếu isAccountNonExpired.isAfter(LocalDateTime.now()) → thời điểm hết hạn nằm sau hiện tại → account chưa expired → return true
        // - Nếu isAccountNonExpired.isBefore(now) → account đã hết hạn → return false

        // true  -> account còn hạn, user có thể login bình thường
        // false -> account hết hạn, Spring Security throw AccountExpiredException và chặn login

        return this.isAccountNonExpired == null || this.isAccountNonExpired.isAfter(LocalDateTime.now());
    }

    @Override
    public boolean isAccountNonLocked() {
        // Kiểm tra xem account có bị lock không
        // true  -> account không bị khóa, user có thể login bình thường
        // false -> account bị khóa, Spring Security sẽ throw LockedException và chặn login
        return this.isAccountNonLocked != null && this.isAccountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Kiểm tra xem credentials (password) còn hợp lệ hay đã expired
        // true  -> password còn hợp lệ, user có thể login
        // false -> password expired, Spring Security throw CredentialsExpiredException, login bị chặn
        return this.isCredentialsNonExpired == null || this.isCredentialsNonExpired.isAfter(LocalDateTime.now());
    }

    @Override
    public boolean isEnabled() {
        // Kiểm tra xem user có active/enabled hay không
        // true  -> account enabled, user có thể login
        // false -> account bị deactivate, Spring Security throw DisabledException, login bị chặn
        return this.isEnabled != null && this.isEnabled;
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

    public Set<UserRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<UserRole> roles) {
        this.roles = roles;
    }

    public Set<GroupUser> getGroups() {
        return groups;
    }

    public void setGroups(Set<GroupUser> groups) {
        this.groups = groups;
    }
}
