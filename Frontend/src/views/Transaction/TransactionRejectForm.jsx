import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import CommonPopupV2 from "../../common/CommonPopupV2";
import { Button, DialogActions, DialogContent, div } from "@mui/material";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";

function TransactionRejectForm () {
  const {t} = useTranslation ();
  const {transactionStore} = useStore ();

  const {
    handleOpenRejectWithdraw,
    handleConfirmRejectListWithdrawTransaction,
    openRejectWithdraw,
  } = transactionStore;

  const validationSchema = Yup.object ({
    note:Yup.string ().trim ().nullable ().required (t ("validation.required")),
  });

  const handleSaveForm = async (values) => {
    await handleConfirmRejectListWithdrawTransaction (values);
  }

  return (
      <CommonPopupV2
          size="sm"
          scroll={"body"}
          open={openRejectWithdraw}
          noDialogContent
          title={"Lý do từ chối"}
          onClosePopup={() => handleOpenRejectWithdraw (false)}
          noIcon={true}
      >
        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={{note:""}}
            onSubmit={handleSaveForm}
        >
          {({isSubmitting, values, setFieldValue, initialValues}) => {
            return (
                <Form autoComplete="off">
                  <DialogContent className="p-6">
                    <div className={"grid grid-cols-12 gap-2"}>
                      <div className="col-span-12">
                        <CommonTextField
                            label="Lý do"
                            name="note"
                            required
                            multiline
                            rows={3}
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
                          onClick={() => handleOpenRejectWithdraw (false)}
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

export default memo (observer (TransactionRejectForm));
