import BaseObjectDto from "./BaseObjectDto";
import { AccountCategoryType } from "../../LocalConstants";

export default class AccountCategoryDto extends BaseObjectDto {
  percentage = null;
  type = AccountCategoryType.UNIT_PRICE_AND_QUANTITY.value;
}
