import api from "../axiosCustom";

const API_PATH = "/api/group";

export const saveGroup = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingGroup = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const getGroupById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const deleteGroup = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleGroupByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};