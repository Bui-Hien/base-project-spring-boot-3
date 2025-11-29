import api from "../axiosCustom";
import FileSaver from 'file-saver';

const API_PATH = "/api/file-description";

export async function saveFile (file) {
  const url = API_PATH + "/save-file";
  let formData = new FormData ();
  formData.append ('file', file);
  const config = {
    showLoading:false,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  }
  return api.post (url, formData, config);
}

export async function saveFilePublic (file) {
  const url = API_PATH + "/public/save-file";
  let formData = new FormData ();
  formData.append ('file', file);
  const config = {
    showLoading:false,
    headers:{
      'Content-Type':'multipart/form-data'
    }
  }
  return api.post (url, formData, config);
}

export const createObjectURL = async (id) => {
  try {
    const url = `${API_PATH}/${id}`;
    const response =
        await api.get (url,
            {
              responseType:'blob',
              showLoading:false
            });
    return URL.createObjectURL (response.data);
  } catch (error) {
    console.error (error);
    return null;
  }
};

export const downloadFileById = async (id) => {
  try {
    if (!id) return;

    const response = await api.get (`${API_PATH}/${id}`, {
      responseType:"blob",
      showLoading:false,
    });

    const disposition = response.headers["content-disposition"];
    let filename = "downloaded-file";
    if (disposition && disposition.includes ("filename=")) {
      filename = decodeURIComponent (
          disposition.split ("filename=")[1].replace (/['"]/g, "")
      );
    }

    const blob = new Blob ([response.data], {
      type:response.headers["content-type"] || "application/octet-stream",
    });

    FileSaver.saveAs (blob, filename);

  } catch (error) {
    console.error ("Download file error:", error);
    return null;
  }
};

export const downloadFilePublicById = async (id) => {
  try {
    if (!id) return;

    const response = await api.get (`${API_PATH}/public/${id}`, {
      responseType:"blob",
      showLoading:false,
    });

    const disposition = response.headers["content-disposition"];
    let filename = "downloaded-file";
    if (disposition && disposition.includes ("filename=")) {
      filename = decodeURIComponent (
          disposition.split ("filename=")[1].replace (/['"]/g, "")
      );
    }

    const blob = new Blob ([response.data], {
      type:response.headers["content-type"] || "application/octet-stream",
    });

    FileSaver.saveAs (blob, filename);

  } catch (error) {
    console.error ("Download file error:", error);
    return null;
  }
};