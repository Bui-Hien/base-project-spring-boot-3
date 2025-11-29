import AuditableDto from "./AuditableDto";

export default class OrderDto extends AuditableDto {
    account = null;
    seller = null;
    buyer = null;
    transactions = [];
    filePath = null;
}
