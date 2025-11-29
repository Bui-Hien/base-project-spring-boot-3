import AuditableDto from "./AuditableDto";

export default class ReportDto extends AuditableDto {
    order = null;
    reason = null;
    content = null;
    response = null;
    status = null;
}
