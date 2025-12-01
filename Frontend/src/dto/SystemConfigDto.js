import AuditableDto from "./AuditableDto";

export default class SystemConfigDto extends AuditableDto {
    key = null;
    type = null;
    value = null;
    description = null;
}
