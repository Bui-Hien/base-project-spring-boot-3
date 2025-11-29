import AuditableDto from "./AuditableDto";

export default class UserDto extends AuditableDto {
  constructor () {
    super ();
    this.displayName = null;
    this.password = null;
    this.confirmPassword = null;
    this.isEnabled = false;
    this.isActive = false;
    this.lastLoginTime = null;
    this.totalLoginFailures = null;
    this.lastLoginFailures = null;
    this.email = null;
    this.avatar = null;
    this.bank = null;
    this.beneficiaryName = null;
    this.accountNumber = null;
    this.accountCategories = [];
    this.roles = [];
    this.wallet = null;
    this.vipLevel = null;
    this.isTrusted = null;
  }
}
