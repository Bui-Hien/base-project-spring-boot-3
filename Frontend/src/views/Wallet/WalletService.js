import api from "../../axiosCustom";

const API_PATH = "/api/wallet";
const API_PATH_TRANSACTION = "/api/transaction";

export const getOptWallet = () => {
  let url = API_PATH + "/get-opt-wallet";
  return api.get (url);
};

export const getWallet = () => {
  let url = API_PATH + "/";
  return api.get (url);
};

export const getTotalBalanceByUser = () => {
  let url = API_PATH + "/total-balance";
  return api.get (url);
};

export const withdrawTransaction = (obj) => {
  let url = API_PATH_TRANSACTION + "/withdraw-transaction";
  return api.post (url, obj);
};
