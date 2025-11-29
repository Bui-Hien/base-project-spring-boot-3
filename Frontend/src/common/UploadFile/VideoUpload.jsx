import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { IconButton, LinearProgress, Tooltip, Typography } from "@mui/material";
import { toast } from "react-toastify";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CommonPopupV2 from "../CommonPopupV2";
import { completeUpload, initUpload, uploadChunk } from "../../service/FileDescriptionVideoService";

const VideoUpload = (props) => {
  const {
    onUploadSuccess,
    title = "Tải lên video",
    maxSizeMB = 200, // Giới hạn file video 200MB
    multiple = false,
    disabled = false,
    iconUpload = <UploadFileIcon />,
    chunkSizeMB = 5 // Kích thước chunk default 5MB
  } = props;

  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setProgress(0);
  };

  const handleChange = async (files) => {
    const fileArray = files instanceof FileList || Array.isArray(files)
        ? Array.from(files)
        : [files];

    setUploading(true);
    setProgress(0);

    try {
      for (const file of fileArray) {
        const uploadIdRes = await initUpload();
        const uploadId = uploadIdRes.data;

        const chunkSize = chunkSizeMB * 1024 * 1024; // MB → bytes
        const totalChunks = Math.ceil(file.size / chunkSize);

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);

          await uploadChunk(uploadId, i, chunk);

          // update progress %
          setProgress(Math.round(((i + 1) / totalChunks) * 100));
        }

        // Complete upload
        const completedRes = await completeUpload(uploadId, file.name);

        if (onUploadSuccess) {
          onUploadSuccess(multiple ? completedRes.data : completedRes.data);
        }

        toast.success(`Upload thành công: ${file.name}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload thất bại. Vui lòng thử lại!");
    } finally {
      setUploading(false);
      setProgress(0);
      handleClose();
    }
  };

  return (
      <>
        <Tooltip title={title}>
          <IconButton onClick={handleOpen} color="primary" disabled={disabled}>
            {iconUpload}
          </IconButton>
        </Tooltip>

        <CommonPopupV2
            size="md"
            scroll="paper"
            open={open}
            noDialogContent
            title={title}
            onClosePopup={handleClose}
            noIcon={true}
        >
          <div className="w-full h-[300px] flex flex-col justify-center items-center p-4">
            {uploading ? (
                <div className="w-full text-center">
                  <Typography mb={1}>Đang upload... {progress}%</Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </div>
            ) : (
                <FileUploader
                    multiple={multiple}
                    name="file"
                    handleChange={handleChange}
                    types={["MP4", "MOV", "AVI", "MKV"]}
                    label={`Kéo & thả hoặc click để chọn video (max ${maxSizeMB}MB mỗi file)`}
                    classes="!h-full !w-full"
                    maxSize={maxSizeMB}
                />
            )}
          </div>
        </CommonPopupV2>
      </>
  );
};

export default VideoUpload;
