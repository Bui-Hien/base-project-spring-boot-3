import api from "../../axiosCustom";

const API_PATH = "/api/system-statistic";

export const getDailyStatistics = (obj) => {
  let url = API_PATH + "/get-daily-statistics";
  return api.post (url, obj);
};

export const getMonthlyStatistics = (obj) => {
  let url = API_PATH + "/get-monthly-statistics";
  return api.post (url, obj);
};

export const getYearlyStatistics = (obj) => {
  let url = API_PATH + "/get-yearly-statistics";
  return api.post (url, obj);
};

export const getSystemStatisticsUser = () => {
  let url = API_PATH + "/public/system-statistic-user";
  return api.get (url);
};

export const getSystemStatisticsMarketingUser = () => {
  let url = API_PATH + "/system-statistic-marketing-user";
  return api.get (url);
};

export const saveSystemStatistics = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

