import api from "../../axiosCustom";

const API_PATH = "/api/post";

export const savePost = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const pagingPost = (searchObject) => {
  var url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const getPostById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const deletePost = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultiplePostByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};

export const pagingPostPublic = (searchObject) => {
  var url = API_PATH + "/public/paging-search";
  return api.post (url, searchObject);
};

export const getPostPublicById = (id) => {
  let url = API_PATH + "/public/" + id;
  return api.get (url);
};

