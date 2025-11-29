import SearchObject from "./SearchObject";

export default class UserSearchDto extends SearchObject {
    isEnabled = null;
    roleIds = null;
    vipLevelId = null;
    accountCategoryIds = [];
}
