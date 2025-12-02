import AuditableDto from "../AuditableDto";

export default class UserDto extends AuditableDto {
  accountNonExpired = null;
  isAccountNonLocked = null;
  credentialsNonExpired = null;
  isEnabled = null;
  isActive = null;
  lastLoginTime = null;
  totalLoginFailures = null;
  lastLoginFailures = null;
  username = null;
  password = null;
  confirmPassword = null;
  roles = [];
  groups = [];
  permissions = [];
}
