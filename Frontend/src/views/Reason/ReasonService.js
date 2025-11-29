import api from "../../axiosCustom";

const API_PATH = "/api/reason";

export const saveReason = (obj) => {
    let url = API_PATH + "/save-or-update";
    return api.post(url, obj);
};

export const pagingReason = (searchObject) => {
    var url = API_PATH + "/paging-search";
    return api.post(url, searchObject);
};

export const getReasonById = (id) => {
    let url = API_PATH + "/" + id;
    return api.get(url);
};

export const deleteReason = (id) => {
    let url = API_PATH + "/" + id;
    return api.delete(url);
};

export const deleteMultipleReasonByIds = (obj) => {
    let url = API_PATH + "/delete-multiple";
    return api.post(url, obj);
};