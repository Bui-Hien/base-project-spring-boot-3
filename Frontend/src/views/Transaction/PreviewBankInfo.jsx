import React, { memo, useEffect, useState } from "react";
import { observer } from "mobx-react-lite"; // nếu bạn dùng MobX
import { createObjectURL, downloadFileById } from "../../service/FileDescriptionService";
import { DialogContent, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import GetAppOutlined from "@mui/icons-material/GetAppOutlined";
import CommonPopupV2 from "../../common/CommonPopupV2";
import CommonPagingAutocomplete from "../../common/Form/CommonPagingAutocomplete";
import { pagingBank } from "../Bank/BankService";
import CommonTextField from "../../common/Form/CommonTextField";
import { Form, Formik } from "formik";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

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

const PreviewBankInfo = ({selectedFile, title, bank, beneficiaryName, accountNumber, icon = <AccountBalanceIcon/>}) => {
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

  useEffect (() => {
    if (selectedFile?.id && open) {
      getPreviewFile ();
    }
  }, [selectedFile?.id, open]);

  const handleClosePopup = () => {
    setOpen (false);
    setImageError (false);
    setFileUrl ("");
  };

  return (
      <>
        <Tooltip title={title || "Xem trước"}>
          <IconButton
              onClick={() => setOpen (true)}
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
          <Formik enableReinitialize initialValues={{bank, beneficiaryName, accountNumber}} onSubmit={() => {
          }}>
            {({values}) => (
                <Form autoComplete="off">
                  <DialogContent className="!p-0">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-6 gap-4">
                        <div className="col-span-12">
                          <h3 className="text-base font-semibold mb-3 text-gray-700">Thông tin ngân hàng</h3>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                          <CommonPagingAutocomplete label="Ngân hàng" name="bank" api={pagingBank} disabled/>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                          <CommonTextField
                              label="Tên người thụ hưởng"
                              name="beneficiaryName"
                              disabled
                          />
                        </div>

                        <div className="col-span-12 md:col-span-4 flex gap-2">
                          <div className="grow">
                            <CommonTextField
                                label="STK"
                                name="accountNumber"
                                disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <Root>
                          {imageError? (
                              <ErrorText>Không thể tải ảnh. Vui lòng thử lại.</ErrorText>
                          ) : (
                              <ImageContainer>
                                <StyledImage
                                    src={fileUrl}
                                    alt={selectedFile?.name || selectedFile?.path || "Preview"}
                                    onError={() => setImageError (true)}
                                />
                                <Tooltip title="Tải xuống" arrow placement="left">
                                  <DownloadButton onClick={() => downloadFileById (selectedFile?.id)} size="medium">
                                    <GetAppOutlined fontSize="small"/>
                                  </DownloadButton>
                                </Tooltip>
                              </ImageContainer>
                          )}
                        </Root>
                      </div>
                    </div>
                  </DialogContent>
                </Form>
            )}
          </Formik>
        </CommonPopupV2>
      </>
  );
};

export default memo (observer (PreviewBankInfo));
