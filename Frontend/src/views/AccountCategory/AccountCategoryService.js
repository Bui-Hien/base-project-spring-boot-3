import api from "../../axiosCustom";

const API_PATH = "/api/account-category";

export const saveAccountCategory = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingAccountCategory = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const publicPagingAccountCategory = (searchObject) => {
  let url = API_PATH + "/public/paging-search";
  return api.post (url, searchObject);
};

export const getAccountCategoryById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const publicGetAccountCategoryByCode = (code) => {
  let url = API_PATH + "/public/code/" + code;
  return api.get (url);
};

export const deleteAccountCategory = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleAccountCategoryByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};