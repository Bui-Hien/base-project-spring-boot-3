import axios from 'axios';
import { refreshToken } from "./auth/authService";
import { API_ENDPOINT, LOGIN_PAGE } from "./appConfig";
import { store } from "./stores";
import { convertDates, removeEmptyFields } from "./LocalFunction";

const getAccessToken = () => localStorage.getItem ("access_token");
const getRefreshToken = () => localStorage.getItem ("refresh_token");

const api = axios.create ({
  baseURL:API_ENDPOINT,
  headers:{'Content-Type':'application/json'}
});

const excludedEndpoints =
    [
      "/api/auth/access-token",
      "/api/auth/refresh-token",
      "/api/auth/forgot-password",
      "/api/auth/reset-password",
      "/api/public/",
      "/api/payment/public/",
      "/api/telegram/",
      "/api/post/public/",
      "/api/file-description/public/",
      "/api/system-config/public/",
      "/api/account/public/",
      "/api/system-statistic/public/",
      "/api/user/public/",
      "/api/notification/public/",
      "/api/account/public/",
      "/api/account-category/public/",
    ];
api.interceptors.request.use (
    (config) => {
      const token = getAccessToken ();
      const isExcluded = excludedEndpoints.some ((endpoint) => config.url.includes (endpoint));

      config.timeout = config?.longRequest? 100000 : 30000;

      // Gắn token nếu không thuộc excluded
      if (!isExcluded && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Redirect nếu không token và không thuộc excluded
      if (!isExcluded && !token) {
        window.location.href = LOGIN_PAGE;
        return Promise.reject ({message:"No access token"});
      }

      if (config.data && !(config.data instanceof FormData)) {
        if (typeof config.data === "object") {
          convertDates (config.data);
        }
        config.data = removeEmptyFields (config.data);
      }

      if (config?.showLoading !== false) {
        store?.callApiLoadingStore?.startRequest ();
      }
      return config;
    },
    (error) => {
      store.callApiLoadingStore.endRequest ();
      return Promise.reject (error);
    }
);


api.interceptors.response.use (
    (response) => {
      store.callApiLoadingStore.endRequest ();
      return response;
    },
    async (error) => {
      store.callApiLoadingStore.endRequest ();
      const originalRequest = error.config;

      // Chỉ retry nếu 401 (Unauthorized), không retry 403 (Forbidden)
      if ((error.response?.status === 401) && !originalRequest._retry) {
        originalRequest._retry = true;

        const refresh = getRefreshToken ();
        if (!refresh) {
          localStorage.clear ();
          window.location.href = "/login";
          return Promise.reject (error);
        }

        try {
          const payload = {refreshToken:refresh};
          const response = await refreshToken (payload);
          const data = response.data?.data;
          if (data) {
            localStorage.setItem ("access_token", data?.accessToken);
            localStorage.setItem ("refresh_token", data?.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api (originalRequest);
          }
        } catch (refreshError) {
          localStorage.clear ();
          window.location.href = "/login";
          return Promise.reject (refreshError);
        }
      }

      // 403 → không có quyền, redirect login
      if (error.response?.status === 403) {
        localStorage.clear ();
        window.location.href = "/login";
      }

      return Promise.reject (error);
    }
);

export default api;
