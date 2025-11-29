import api from "../../axiosCustom";

const API_PATH = "/api/transaction";

export const pagingTransaction = (searchObject) => {
  var url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const updateAttachment = (id, fileId) => {
  var url = API_PATH + `/update-attachment/${id}/${fileId}`;
  return api.put (url);
};

export const updateStatusWithdrawTransaction = (obj) => {
  let url = API_PATH + "/confirm-withdraw";
  return api.post (url, obj);
};

export const confirmDepositTransaction = (obj) => {
  let url = API_PATH + "/confirm-deposit";
  return api.post (url, obj);
};

export const clientConfirmDeposit = (id) => {
  let url = API_PATH + "/client-confirm-deposit/" + id;
  return api.put (url);
};

export const updateListRejectStatusWithdrawTransaction = (obj) => {
  let url = API_PATH + "/reject-withdraw";
  return api.post (url, obj);
};

export const deleteTransactionsOlderThan = (day) => {
  let url = API_PATH + "/delete-older/" + day;
  return api.delete (url);
};

