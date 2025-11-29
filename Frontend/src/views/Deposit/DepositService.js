import api from "../../axiosCustom";

const API_PATH = "/api/payment";

export const pay = (amount) => {
  let url = API_PATH + "/vn-pay/" + amount;
  return api.get (url);
};

export const getUrlVietQr = (amount) => {
  const url = `${API_PATH}/viet-qr?amount=${amount}`;
  return api.get (url);
};