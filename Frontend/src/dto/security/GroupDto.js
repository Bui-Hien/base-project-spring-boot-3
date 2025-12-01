import AuditableDto from "../AuditableDto";

export default class GroupDto extends AuditableDto {
  name = null;
  description = null;
  roles = [];
}
