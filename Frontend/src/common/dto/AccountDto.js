import AuditableDto from "./AuditableDto";

export default class AccountDto extends AuditableDto {
  accountName = null;
  password = null;
  unitPrice = null;
  price = null;
  totalAmount = null;
  warrantyPeriod = 5;
  status = null;
  twoFactor = null;
  premium = false;
  warrantyIssued = false;
  owner = null;
  accountCategory = null;
  description = null;
}
