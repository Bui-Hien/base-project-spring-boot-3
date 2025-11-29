import AuditableDto from "./AuditableDto";

export default class TransactionDto extends AuditableDto {
  code = null;
  user = null;
  amount = null;
  type = null;
  status = null;
  balanceBefore = null;
  balanceAfter = null;
  description = null;
  attachment = null;
  order = null;
  vnpBankCode = null;
  vnpCreateDate = null;
  vnpExpireDate = null;
  vnpIpAddr = null;
  vnpRspCode = null;
}
