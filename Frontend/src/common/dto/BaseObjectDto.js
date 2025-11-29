import AuditableDto from "./AuditableDto";

export default class BaseObjectDto extends AuditableDto {
    code = null;
    name = null;
    description = null;
}