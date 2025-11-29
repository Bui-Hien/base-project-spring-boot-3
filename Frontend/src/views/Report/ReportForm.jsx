import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import CommonPopupV2 from "../../common/CommonPopupV2";
import { Button, DialogActions, DialogContent } from "@mui/material";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import CommonPagingAutocomplete from "../../common/Form/CommonPagingAutocomplete";
import { pagingReason } from "../Reason/ReasonService";
import { useStore } from "../../stores";

function ReportForm (props) {
  const {t} = useTranslation ();
  const {authStore} = useStore ();
  const {currentUser} = authStore;
  const {
    handleClose,
    handleSave,
    innitValue,
    open,
    disabled = false
  } = props;

  const validationSchema = Yup.object ({});


  async function handleSaveForm (values) {
    await handleSave (values);
  }
console.log(innitValue);
  return (
      <CommonPopupV2
          size="sm"
          scroll={"body"}
          open={open}
          noDialogContent
          title={(innitValue?.id? t ("general.button.edit") : t ("general.button.add")) + ' ' + t ("Khiếu nại")}
          onClosePopup={handleClose}
          isCreate={!innitValue?.id}
      >
        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={{...innitValue}}
            onSubmit={handleSaveForm}
        >
          {({isSubmitting, values, setFieldValue, initialValues}) => {
            return (
                <Form autoComplete="off">
                  <DialogContent className="p-6">
                    <div className={"grid grid-cols-12 gap-2"}>
                      <div className="col-span-12">
                        <CommonPagingAutocomplete
                            label="Lý do"
                            name="reason"
                            api={pagingReason}
                            disabled={disabled || innitValue?.id}
                            required
                        />
                      </div>

                      <div className="col-span-12">
                        <CommonTextField
                            label="Nội dung khiếu nại"
                            name="content"
                            multiline
                            rows={3}
                            disabled={disabled || innitValue?.id || innitValue?.order?.buyer?.id !== currentUser?.id}
                        />
                      </div>

                      <div className="col-span-12">
                        <CommonTextField
                            label="Trả lời"
                            name="response"
                            multiline
                            rows={3}
                            disabled={disabled || innitValue?.response || innitValue?.order?.seller?.id !== currentUser?.id}
                        />
                      </div>
                    </div>
                  </DialogContent>

                  <DialogActions className="px-6 pb-4">
                    <div className="flex justify-end w-full">
                      <Button
                          variant="outlined"
                          color="secondary"
                          disabled={isSubmitting}
                          onClick={handleClose}
                          className="rounded-lg px-4 py-2 !mr-2 !bg-red-500"
                          startIcon={<CloseIcon/>}
                      >
                        {t ("general.button.close")}
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
      </CommonPopupV2>
  );
}

export default memo (observer (ReportForm));
