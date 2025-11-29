import api from "../../axiosCustom";

const API_PATH = "/api/order";

export const pagingOrder = (searchObject) => {
  let url = API_PATH + "/paging-search";
  return api.post (url, searchObject);
};

export const exportExcel = (searchObject) => {
  let url = API_PATH + "/export-excel";
  return api ({
    method:"post",
    url:url,
    data:searchObject,
    responseType:"blob",
    showLoading:false,
    longRequest:true
  });
};

export const getOrderById = (id) => {
  let url = API_PATH + "/" + id;
  return api.get (url);
};

export const deleteOrder = (id) => {
  let url = API_PATH + "/" + id;
  return api.delete (url);
};

export const deleteMultipleOrderByIds = (obj) => {
  let url = API_PATH + "/delete-multiple";
  return api.post (url, obj);
};

export const saveOrder = (obj) => {
  let url = API_PATH + "/save-or-update";
  return api.post (url, obj);
};

export const refundTransactionSellerToBuyer = (data) => {
  const url = API_PATH + "/refund-to-buyer";
  return api.post(url , data);
};

export const refundTransactionBuyerToSeller = (orderData) => {
  const url = API_PATH + "/refund-to-seller";
  return api.post(url , orderData);
}