import api from "../axiosCustom";

const API_PATH = "/api/permission";

export const pagingPermission = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};
