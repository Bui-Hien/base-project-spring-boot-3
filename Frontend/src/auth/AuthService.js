import api from "../axiosCustom";
import ConstantList from "../appConfig";

const API_PATH = ConstantList.API_ENDPOINT + "/api/auth";
const API_PATH_USER = ConstantList.API_ENDPOINT + "/api/user";

export const accessToken = (obj) => {
  let url = API_PATH + "/access-token";
  return api.post (url, obj);
};

export const refreshToken = (obj) => {
  let url = API_PATH + "/refresh-token";
  return api.post (url, obj);
};

export const removeToken = (obj) => {
  let url = API_PATH + "/remove-token";
  return api.post (url, obj);
};

export const forgotPassword = (obj) => {
  let url = API_PATH + "/forgot-password";
  return api.post (url, obj);
};

export const resetPassword = (obj) => {
  let url = API_PATH + "/reset-password";
  return api.post (url, obj);
};

export const getCurrentUser = () => {
  let url = API_PATH_USER + "/get-current-user";
  return api.get (url);
};