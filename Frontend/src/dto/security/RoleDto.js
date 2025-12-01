import AuditableDto from "../AuditableDto";

export default class RoleDto extends AuditableDto {
  name = null;
  description = null;
  permissions = [];
}
