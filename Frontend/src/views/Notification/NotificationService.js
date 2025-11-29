import api from "../../axiosCustom";

const API_PATH = "/api/notification";

export const saveNotification = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingNotification = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const pagingSearchPublic = (searchObject) => {
  let url = API_PATH + "/public/paging-search";
  return api.post (url, searchObject);
};

export const getNotificationById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const deleteNotification = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleNotificationByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};

