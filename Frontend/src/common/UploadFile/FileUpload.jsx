import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { toast } from "react-toastify";
import CommonPopupV2 from "../CommonPopupV2";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { saveFile, saveFilePublic } from "../../service/FileDescriptionService";

const FileUpload = (props) => {
  const {
    fileTypes = ["JPG", "PNG", "GIF", "JPEG", "PDF"],
    onUploadSuccess,
    title = "Tải lên ảnh hoặc PDF",
    maxSizeMB = 5, // Nhận giá trị MB từ props
    multiple = false,
    disabled = false,
    isApiPublic = false,
    iconUpload = <UploadFileIcon/>
  } = props;

  const [open, setOpen] = useState (false);
  const [error, setError] = useState (null);
  const [uploading, setUploading] = useState (false);

  const handleOpen = () => setOpen (true);
  const handleClose = () => {
    setOpen (false);
    setError (null);
  };

  const handleChange = async (files) => {
    const fileArray = files instanceof FileList || Array.isArray (files)
        ? Array.from (files)
        : [files];

    console.log ("Files:", fileArray);
    console.log ("Number of files:", fileArray.length);

    try {
      setUploading (true);
      const results = [];
      const errors = [];

      for (const file of fileArray) {
        console.log ("Processing file:", file.name, file.size);
        try {
          const res = isApiPublic? await saveFilePublic (file) : await saveFile (file);
          results.push (res?.data?.data);
        } catch (err) {
          console.error ("Upload failed for file:", file.name, err);
          errors.push ({fileName:file.name, error:err});
          toast.error (`Upload thất bại: ${file.name}`);
        }
      }

      if (results.length > 0) {
        const returnData = multiple? results : results[0];

        if (onUploadSuccess) onUploadSuccess (returnData);

        if (errors.length === 0) {
          const successMessage = multiple
              ? `Upload thành công ${results.length} file!`
              : "Upload thành công!";
          toast.success (successMessage);
          handleClose ();
        } else {
          toast.warning (`Upload thành công ${results.length}/${fileArray.length} file`);
        }
      } else {
        toast.error ("Không có file nào được upload thành công");
        setError ("Tải file thất bại");
      }
    } catch (err) {
      console.error (err);
      toast.error ("Upload file thất bại. Vui lòng thử lại.");
      setError ("Tải file thất bại");
    } finally {
      setUploading (false);
    }
  };

  return (
      <>
        <Tooltip title={title}>
          <IconButton
              onClick={handleOpen}
              color="primary"
              aria-label="upload file"
              disabled={disabled}
          >
            {iconUpload}
          </IconButton>
        </Tooltip>

        <CommonPopupV2
            size="xs"
            scroll={"paper"}
            open={open}
            noDialogContent
            title={title}
            onClosePopup={handleClose}
            noIcon={true}
        >
          <div className="w-full h-[250px] mx-auto">
            <div className="p-4 h-full w-full">
              {uploading? (
                  <div className="w-full h-full flex justify-center items-center">
                    <CircularProgress/>
                  </div>
              ) : (
                  <FileUploader
                      multiple={multiple}
                      name={"file"}
                      handleChange={handleChange}
                      types={fileTypes}
                      label={multiple
                          ? `Kéo & thả hoặc click để chọn nhiều file (max ${maxSizeMB}MB mỗi file)`
                          : `Kéo & thả hoặc click để chọn file (max ${maxSizeMB}MB)`
                      }
                      classes={"!h-full !w-full"}
                      maxSize={maxSizeMB} // FileUploader tự động tính toán MB
                  />
              )}
            </div>
            {error && (
                <Typography mt={1} color="error">
                  {error}
                </Typography>
            )}
          </div>
        </CommonPopupV2>
      </>
  );
};

export default FileUpload;