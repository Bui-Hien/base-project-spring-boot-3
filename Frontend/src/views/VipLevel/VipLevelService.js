import api from "../../axiosCustom";

const API_PATH = "/api/vip-level";

export const saveVipLevel = (obj) => {
    let url = API_PATH + "/save-or-update";
    return api.post(url, obj);
};

export const pagingVipLevel = (searchObject) => {
    var url = API_PATH + "/paging-search";
    return api.post(url, searchObject);
};

export const getVipLevelById = (id) => {
    let url = API_PATH + "/" + id;
    return api.get(url);
};

export const deleteVipLevel = (id) => {
    let url = API_PATH + "/" + id;
    return api.delete(url);
};

export const deleteMultipleVipLevelByIds = (obj) => {
    let url = API_PATH + "/delete-multiple";
    return api.post(url, obj);
};