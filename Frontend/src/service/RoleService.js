import api from "../axiosCustom";

const API_PATH = "/api/role";

export const saveRole = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingRole = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const getRoleById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const deleteRole = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleRoleByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};