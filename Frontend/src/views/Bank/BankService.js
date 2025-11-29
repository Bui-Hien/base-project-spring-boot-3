import api from "../../axiosCustom";

const API_PATH = "/api/bank";

export const saveBank = (obj) => {
    let url = API_PATH + "/save-or-update";
    return api.post(url, obj);
};

export const pagingBank = (searchObject) => {
    var url = API_PATH + "/paging-search";
    return api.post(url, searchObject);
};

export const getBankById = (id) => {
    let url = API_PATH + "/" + id;
    return api.get(url);
};

export const deleteBank = (id) => {
    let url = API_PATH + "/" + id;
    return api.delete(url);
};

export const deleteMultipleBankByIds = (obj) => {
    let url = API_PATH + "/delete-multiple";
    return api.post(url, obj);
};

