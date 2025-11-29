import { useNavigate } from "react-router-dom";
import React, { memo, useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Avatar, Button, DialogActions, DialogContent } from "@mui/material";
import { observer } from "mobx-react-lite";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import CommonTextField from "../../../common/Form/CommonTextField";
import CommonPagingAutocomplete from "../../../common/Form/CommonPagingAutocomplete";
import { pagingBank } from "../../Bank/BankService";
import PreviewFileViewer from "../../../common/UploadFile/PreviewFileViewer";
import FileUpload from "../../../common/UploadFile/FileUpload";
import { pagingAccountCategory } from "../../AccountCategory/AccountCategoryService";
import { pagingRole } from "../UserService";
import { useStore } from "../../../stores";
import { API_ENDPOINT } from "../../../appConfig";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { SystemRole } from "../../../LocalConstants";

function UserInfoTab () {
  const navigate = useNavigate ();
  const {t} = useTranslation ();
  const {userStore, authStore} = useStore ();
  const dialogActionsRef = useRef (null);
  const [actionHeight, setActionHeight] = useState (0);

  const {
    updateDataInfo,
  } = userStore;

  const {currentUser, roles, getCurrentUser} = authStore;

  // Lấy chiều cao của DialogActions
  useEffect (() => {
    const updateHeight = () => {
      if (dialogActionsRef.current) {
        const height = dialogActionsRef.current.offsetHeight;
        setActionHeight (height);
      }
    };

    // Update height khi component mount
    updateHeight ();

    // Update height khi window resize
    window.addEventListener ('resize', updateHeight);

    // Cleanup
    return () => window.removeEventListener ('resize', updateHeight);
  }, []);

  const validationSchema = () =>
      Yup.object ({
        displayName:Yup.string ()
            .nullable ()
            .required (t ("validation.required")),
        email:Yup.string ()
            .required (t ("validation.required"))
            .email (t ("Email không hợp lệ")),

        bank:Yup.object ().nullable ().notRequired (),
        bankQrCode:Yup.object ().nullable ().notRequired (),
        beneficiaryName:Yup.string ().when ("bank", {
          is:(val) => !!val,
          then:(schema) => schema.required (t ("validation.required")),
          otherwise:(schema) => schema.notRequired (),
        }),
        accountNumber:Yup.string ().when ("bank", {
          is:(val) => !!val,
          then:(schema) => schema.required (t ("validation.required")),
          otherwise:(schema) => schema.notRequired (),
        }),
      });

  async function handleSaveForm (values) {
    await updateDataInfo (values);
    getCurrentUser ();
  }

  const isSeller = roles?.includes (SystemRole.ROLE_SELLER);
  return (
      <Formik
          validationSchema={validationSchema}
          enableReinitialize
          initialValues={{... currentUser}}
          onSubmit={handleSaveForm}
      >
        {({isSubmitting, values, setFieldValue, initialValues}) => {
          return (
              <Form autoComplete="off" className={"relative"}>
                {/* Thêm padding bottom động dựa trên chiều cao của DialogActions */}
                <DialogContent
                    className="!px-0"
                    style={{paddingBottom:`${actionHeight + 24}px`}}
                >
                  <div className="grid grid-cols-12 gap-6">
                    {/* Cột trái: Username và Avatar */}
                    <div className="col-span-12 lg:col-span-4">
                      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg h-full">
                        {/* Avatar */}
                        <div className="relative">
                          <Avatar
                              alt={values?.displayName}
                              src={`${API_ENDPOINT}/api/file-description/public/${values?.avatar?.id}`}
                              sx={{width:200, height:200}}
                              className="border-4 border-white shadow-lg"
                          />
                        </div>

                        {/* Upload Avatar */}
                        <div className="flex gap-2">
                          <FileUpload
                              onUploadSuccess={(file) => {
                                setFieldValue ("avatar", file)
                              }}
                              title="Tải ảnh"
                              multiple={false}
                              isApiPublic={true}
                              iconUpload={
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className="!text-white !rounded-lg !shadow-md hover:!shadow-lg transition-all"
                                    startIcon={<CameraAltIcon/>}
                                >
                                  Thay đổi ảnh
                                </Button>
                              }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cột phải: Thông tin người dùng */}
                    <div className="col-span-12 lg:col-span-8">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-4">
                          <CommonTextField
                              label="Tên người dùng"
                              name="displayName"
                              required
                          />
                        </div>
                        {/* Email */}
                        <div className="col-span-12 md:col-span-4">
                          <CommonTextField
                              label="Mail"
                              name="email"
                              disabled
                          />
                        </div>

                        {isSeller && (
                            <>
                              {/* Thông tin ngân hàng */}
                              <div className="col-span-12">
                                <h3 className="text-base font-semibold mb-3 text-gray-700">Thông tin ngân hàng</h3>
                              </div>

                              <div className="col-span-12 md:col-span-4">
                                <CommonPagingAutocomplete
                                    label="Ngân hàng"
                                    name="bank"
                                    api={pagingBank}
                                />
                              </div>

                              <div className="col-span-12 md:col-span-4">
                                <CommonTextField
                                    label="Tên người thụ hưởng"
                                    name="beneficiaryName"
                                    required={values?.bank?.id}
                                />
                              </div>

                              <div className="col-span-12 md:col-span-4 flex gap-2">
                                <div className="grow">
                                  <CommonTextField
                                      label="STK"
                                      name="accountNumber"
                                      required={values?.bank?.id}
                                  />
                                </div>
                                <div className="flex gap-2 items-end flex-none">
                                  <PreviewFileViewer
                                      selectedFile={values?.bankQrCode}
                                      disabled={!values?.bankQrCode?.id}
                                      title={"Xem qr code"}
                                  />
                                  <FileUpload
                                      onUploadSuccess={(file) => {
                                        setFieldValue ("bankQrCode", file)
                                      }}
                                      title="Tải QR"
                                      multiple={false}
                                  />
                                </div>
                              </div>

                              {/* Phân quyền */}
                              <div className="col-span-12 mt-4">
                                <h3 className="text-base font-semibold mb-3 text-gray-700">Phân quyền</h3>
                              </div>

                              <div className="col-span-12">
                                <CommonPagingAutocomplete
                                    label="Danh mục tài khoản được bán"
                                    name="accountCategories"
                                    api={pagingAccountCategory}
                                    multiple
                                    disabled
                                />
                              </div>
                            </>
                        )}
                        <div className="col-span-12">
                          <CommonPagingAutocomplete
                              label="Quyền hạn người dùng"
                              name="roles"
                              api={pagingRole}
                              disabled
                              multiple
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>

                {/* Fixed bottom với ref để lấy chiều cao */}
                <DialogActions
                    ref={dialogActionsRef}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10"
                >
                  <div className="px-4 sm:px-6 py-2 flex justify-end w-full gap-2">
                    <Button
                        variant="outlined"
                        color="secondary"
                        disabled={isSubmitting}
                        onClick={() => navigate (-1)}
                        className="rounded-lg px-4 py-2"
                        startIcon={<CloseIcon/>}
                    >
                      {t ("Quay lại")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg px-4 py-2"
                        startIcon={<SaveIcon/>}
                    >
                      {t ("general.button.save")}
                    </Button>
                  </div>
                </DialogActions>
              </Form>
          );
        }
        }
      </Formik>
  );
}

export default memo (observer (UserInfoTab));