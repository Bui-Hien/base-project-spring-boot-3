import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import CommonPopupV2 from "../../common/CommonPopupV2";
import { Button, DialogActions, DialogContent } from "@mui/material";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";

function UserForm () {
  const {t} = useTranslation ();
  const {userStore} = useStore ();

  const {
    handleClose,
    saveUser,
    selectedRow,
    openCreateEditPopup,
  } = userStore;

  const validationSchema = (isRequitedPass) =>
      Yup.object ({
        displayName:Yup.string ().required (t ("validation.required")),

        password:isRequitedPass
            ? Yup.string ().required (t ("validation.required"))
            : Yup.string ().notRequired (),

        confirmPassword:isRequitedPass
            ? Yup.string ()
                .required (t ("validation.required"))
                .oneOf (
                    [Yup.ref ("password")],
                    t ("Mật khẩu mới và mật khẩu xác nhận không khớp")
                )
            : Yup.string ().notRequired (),

        isEnabled:Yup.bool ().notRequired (),
        isActive:Yup.bool ().notRequired (),

        email:Yup.string ()
            .required (t ("validation.required"))
            .email (t ("Email không hợp lệ")),

        bank:Yup.object ().nullable ().notRequired (),

        beneficiaryName:Yup.string ().when ("bank", {
          is:(val) => !!val, // nếu bank có giá trị
          then:(schema) => schema.required (t ("validation.required")),
          otherwise:(schema) => schema.notRequired (),
        }),

        accountNumber:Yup.string ().when ("bank", {
          is:(val) => !!val,
          then:(schema) => schema.required (t ("validation.required")),
          otherwise:(schema) => schema.notRequired (),
        }),

        accountCategories:Yup.array ()
            .of (Yup.object ())
            .notRequired (),

        roles:Yup.array ()
            .of (Yup.object ())
            .min (1, t ("validation.required")),
      });

  async function handleSaveForm (values) {
    await saveUser (values);
  }

  return (
      <CommonPopupV2
          size="lg"
          scroll={"body"}
          open={openCreateEditPopup}
          noDialogContent
          title={(selectedRow?.id? t ("general.button.edit") : t ("general.button.add")) + ' ' + t ("người dùng")}
          onClosePopup={handleClose}
          isCreate={!selectedRow?.id}
      >
        <Formik
            validationSchema={validationSchema (!selectedRow?.id)}
            enableReinitialize
            initialValues={selectedRow}
            onSubmit={handleSaveForm}
        >
          {({isSubmitting, values, setFieldValue, initialValues}) => {
            return (
                <Form autoComplete="off">
                  <DialogContent className="p-6">
                    <div className={"grid grid-cols-12 gap-2"}>
                      <div className="col-span-12 md:col-span-4">
                        <CommonTextField
                            label="Tên người dùng"
                            name="displayName"
                            required
                        />
                      </div>
                    </div>

                  </DialogContent>

                  <DialogActions className="px-8 py-4 bg-gray-50 rounded-b-xl border-t">
                    <div className="flex justify-end w-full space-x-3">
                      {/* Nút Đóng */}
                      <Button
                          variant="outlined"
                          color="secondary"
                          disabled={isSubmitting}
                          onClick={handleClose}
                          className="rounded-lg px-5 py-2 !text-gray-700 !border-gray-300 hover:!bg-gray-100 transition"
                          startIcon={<CloseIcon/>}
                      >
                        {t ("general.button.close")}
                      </Button>

                      {/* Nút Lưu */}
                      <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-lg px-5 py-2 !bg-blue-600 hover:!bg-blue-700 transition"
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
      </CommonPopupV2>
  );
}

export default memo (observer (UserForm));
