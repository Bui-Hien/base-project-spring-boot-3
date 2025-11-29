import AuditableDto from "./AuditableDto";

export default class AccountDto extends AuditableDto {
    contentType = null;
    contentSize = null;
    name = null;
    extension = null;
    filePath = null;
}
