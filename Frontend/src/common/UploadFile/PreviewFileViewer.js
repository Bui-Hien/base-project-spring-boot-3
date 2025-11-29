import React, { memo, useState } from "react";
import { createObjectURL, downloadFileById, downloadFilePublicById } from "../../service/FileDescriptionService";
import { DialogContent, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import CommonPopupV2 from "../CommonPopupV2";
import GetAppOutlined from "@mui/icons-material/GetAppOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { API_ENDPOINT } from "../../appConfig";

// Styled components
const Root = styled ("div") ({
  width:"100%",
  height:"100%",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  minHeight:400,
});

const ImageContainer = styled ("div") (({theme}) => ({
  position:"relative",
  width:"100%",
  maxWidth:800,
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:theme.palette.grey[50],
  borderRadius:theme.shape.borderRadius * 2,
  padding:theme.spacing (2),
  boxShadow:theme.shadows[2],
}));

const StyledImage = styled ("img") ({
  maxWidth:"100%",
  maxHeight:"70vh",
  width:"auto",
  height:"auto",
  objectFit:"contain",
  borderRadius:8,
  display:"block",
});

const DownloadButton = styled (IconButton) (({theme}) => ({
  position:"absolute",
  right:12,
  top:12,
  backgroundColor:theme.palette.background.paper,
  boxShadow:theme.shadows[3],
  transition:"all 0.2s ease-in-out",
  "&:hover":{
    backgroundColor:theme.palette.primary.main,
    transform:"scale(1.1)",
    "& .MuiSvgIcon-root":{
      color:theme.palette.common.white,
    },
  },
}));

const ErrorText = styled ("div") (({theme}) => ({
  padding:theme.spacing (4),
  textAlign:"center",
  color:theme.palette.text.secondary,
  fontSize:16,
}));

// Component chính
const PreviewFileViewer = ({selectedFile, title, disabled, isPublic = false, icon = <VisibilityIcon/>}) => {
  const [fileUrl, setFileUrl] = useState ("");
  const [open, setOpen] = useState (false);
  const [imageError, setImageError] = useState (false);

  const getPreviewFile = async () => {
    try {
      const result = await createObjectURL (selectedFile?.id);
      setFileUrl (result);
      setImageError (false);
    } catch (err) {
      console.error (err);
      setImageError (true);
    }
  };

  const handleGetFilePreview = async () => {
    setOpen (true);
    if (!isPublic) {
      if (!selectedFile?.id) return;
      await getPreviewFile ();
    }
  };

  const handleClosePopup = () => {
    setOpen (false);
    setImageError (false);
    setFileUrl ("");
  };

  return (
      <>
        <Tooltip title={title || "Xem trước"}>
          <IconButton
              disabled={disabled || !selectedFile}
              onClick={handleGetFilePreview}
          >
            {icon}
          </IconButton>
        </Tooltip>

        <CommonPopupV2
            size="lg"
            open={open}
            onClosePopup={handleClosePopup}
            title={title || selectedFile?.name || "Xem trước file"}
            noIcon
        >
          <DialogContent className="!p-0">
            <Root>
              {imageError? (
                  <ErrorText>Không thể tải ảnh. Vui lòng thử lại.</ErrorText>
              ) : (
                  <ImageContainer>
                    <StyledImage
                        src={
                          isPublic
                              ? `${API_ENDPOINT}/api/file-description/public/${selectedFile?.id}`
                              : fileUrl
                        }
                        alt={selectedFile?.name || selectedFile?.path || "Preview"}
                        onError={() => setImageError (true)}
                    />
                    <Tooltip title="Tải xuống" arrow placement="left">
                      <DownloadButton
                          onClick={() => {
                            if (isPublic) {
                              return downloadFilePublicById (selectedFile?.id);
                            }
                            return downloadFileById (selectedFile?.id)
                          }}
                          size="medium"
                      >
                        <GetAppOutlined fontSize="small"/>
                      </DownloadButton>
                    </Tooltip>
                  </ImageContainer>
              )}
            </Root>
          </DialogContent>
        </CommonPopupV2>
      </>
  );
};

export default memo (observer (PreviewFileViewer));