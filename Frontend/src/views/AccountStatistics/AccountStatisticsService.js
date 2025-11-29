import api from "../../axiosCustom";

const API_PATH = "/api/order";

export const getOverallStatistics = (searchObject) => {
  let url = API_PATH + "/overall-statistics";
  return api.post (url, searchObject);
};

export const getAccountStatisticsByUser = (searchObject) => {
  let url = API_PATH + "/account-statistics-by-user";
  return api.post (url, searchObject);
};

export const getRevenueByDay = (searchObject) => {
  let url = API_PATH + "/revenue-by-day";
  return api.post (url, searchObject);
};

export const getRevenueByMonth = (searchObject) => {
  let url = API_PATH + "/revenue-by-month";
  return api.post (url, searchObject);
};
