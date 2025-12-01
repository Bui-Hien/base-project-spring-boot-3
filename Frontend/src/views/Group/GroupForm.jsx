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
import CommonPagingAutocomplete from "../../common/Form/CommonPagingAutocomplete";
import { pagingRole } from "../../service/RoleService";

function GroupForm (props) {
  const {t} = useTranslation ();
  const {groupStore} = useStore ();

  const {
    handleClose,
    saveGroup,
    selectedRow,
    openCreateEditPopup,
  } = groupStore;

  const validationSchema = Yup.object ({
    name:Yup.string ().trim ().nullable ().required (t ("validation.required")),
    description:Yup.string ().nullable (),
    roles:Yup.array ().nullable (),
  });


  async function handleSaveForm (values) {
    await saveGroup (values);
  }

  return (
      <CommonPopupV2
          size="sm"
          scroll={"body"}
          open={openCreateEditPopup}
          noDialogContent
          title={(selectedRow?.id? t ("general.button.edit") : t ("general.button.add")) + ' ' + t ("Nhóm quyền")}
          onClosePopup={handleClose}
          isCreate={!selectedRow?.id}
      >
        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={selectedRow}
            onSubmit={handleSaveForm}
        >
          {({isSubmitting, values, setFieldValue, initialValues}) => {
            return (
                <Form autoComplete="off">
                  <DialogContent className="p-6">
                    <div className={"grid grid-cols-12 gap-2"}>
                      <div className="col-span-12">
                        <CommonTextField
                            label={t ("Nhóm quyền")}
                            name="name"
                            required
                        />
                      </div>
                      <div className="col-span-12">
                        <CommonPagingAutocomplete
                            label={t ("Quyền")}
                            name="roles"
                            api={pagingRole}
                            multiple
                        />
                      </div>
                      <div className="col-span-12">
                        <CommonTextField
                            label={t ("Mô tả")}
                            name="description"
                            multiline
                            rows={3}
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

export default memo (observer (GroupForm));
