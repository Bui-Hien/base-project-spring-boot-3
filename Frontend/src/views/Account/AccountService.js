import api from "../../axiosCustom";

const API_PATH = "/api/account";

export const saveAccount = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};
export const updateAccountStatusNew = (obj) => {
  let url = API_PATH + "/update-status-new";
  return api.post (url, obj);
};
export const updateAccountStatusErr = (obj) => {
  let url = API_PATH + "/update-status-err";
  return api.post (url, obj);
};

export const pagingAccount = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const publicPagingSearchAccount = (searchObject) => {
  let url = API_PATH + "/public/paging-search";
  return api.post (url, searchObject);
};

export const publicPrice = () => {
  let url = API_PATH + "/public/price";
  return api.get (url);
};

export const getAccountById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const deleteAccount = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleAccountByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};