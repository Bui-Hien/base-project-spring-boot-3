import api from "../../axiosCustom";

const API_PATH = "/api/report";

export const saveReport = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingReport = (searchObject) => {
  var url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const getReportById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};
export const updateStatus = (searchObject) => {
  let url = API_PATH + "/update-status";
  return api.post (url, searchObject);
};

export const deleteReport = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleReportByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};