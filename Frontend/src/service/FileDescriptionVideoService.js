import api from "../axiosCustom";
import FileSaver from "file-saver";

const API_PATH = "/api/video";

/* =========================================================
 * 1) INIT UPLOAD – tạo uploadId cho video chunked upload
 * ========================================================= */
export function initUpload () {
  // return 1 uploadId từ server
  return api.post (`${API_PATH}/init`);
}

/* =========================================================
 * 2) UPLOAD CHUNK – upload từng chunk video
 * ========================================================= */
export function uploadChunk (uploadId, index, fileChunk) {
  const formData = new FormData ();
  formData.append ("uploadId", uploadId);
  formData.append ("index", index);
  formData.append ("chunk", fileChunk);

  return api.post (`${API_PATH}/upload`, formData, {
    headers:{"Content-Type":"multipart/form-data"},
  });
}

/* =========================================================
 * 3) COMPLETE UPLOAD – merge file + chuyển sang HLS
 * ========================================================= */
export function completeUpload (uploadId, fileName) {
  const formData = new FormData ();
  formData.append ("uploadId", uploadId);
  formData.append ("fileName", fileName);

  return api.post (`${API_PATH}/complete`, formData, {
    headers:{"Content-Type":"multipart/form-data"},
  });
}

/* =========================================================
 * 4) GET MANIFEST HLS – trả về URL để video player play
 * ========================================================= */
export function getHlsManifestUrl (id) {
  // return URL biến thành string để pass cho video.js hoặc hls.js
  return `${API_PATH}/hls/${id}/manifest.m3u8`;
}

/* =========================================================
 * 5) GET SEGMENT HLS – không cần viết hàm gọi fetch,
 * video player sẽ tự gọi
 * ========================================================= */
export function getHlsSegmentUrl (id, segment) {
  return `${API_PATH}/hls/${id}/${segment}`;
}

/* =========================================================
 * 6) DOWNLOAD RAW MP4 – tải file gốc
 * ========================================================= */
export function downloadRaw (id) {
  return api
      .get (`${API_PATH}/raw/${id}`, {
        responseType:"blob",
      })
      .then ((res) => {
        FileSaver.saveAs (res.data, `${id}.mp4`);
      });
}
