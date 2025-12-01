import api from "../axiosCustom";

const API_PATH = "/api/system-config";

export const saveSystemConfig = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingSystemConfig = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};
export const getAllSystemConfig = () => {
  let url = API_PATH + "/public/all";
  return api.get (url);
};

export const getSystemConfigById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};
