export default class SearchObject {
  id = null;
  ownerId = null;
  owner = null;
  pageIndex = 1;
  pageSize = 10;
  keyword = null;
  fromDate = null;
  toDate = null;
  voided = null;
  orderBy = null;
  roleId = null;
  parentId = null;
  exportExcel = null;

  constructor () {
    this.id = null;
    this.ownerId = null;
    this.owner = null;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.keyword = '';
    this.fromDate = null;
    this.toDate = null;
    this.voided = null;
    this.orderBy = null;
    this.roleId = null;
    this.parentId = null;
    this.exportExcel = null;
  }
}
