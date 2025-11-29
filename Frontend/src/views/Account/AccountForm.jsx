import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import CommonPopupV2 from "../../common/CommonPopupV2";
import { Button, DialogActions, DialogContent } from "@mui/material";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { pagingAccountCategory } from "../AccountCategory/AccountCategoryService";
import CommonPagingAutocomplete from "../../common/Form/CommonPagingAutocomplete";
import CommonCheckBox from "../../common/Form/CommonCheckBox";
import CommonNumberInput from "../../common/Form/CommonNumberInput";
import CommonVNDCurrencyInput from "../../common/Form/CommonVNDCurrencyInput";
import { AccountCategoryType, AccountStatus } from "../../LocalConstants";

function AccountForm () {
  const {t} = useTranslation ();
  const {accountStore} = useStore ();
  const {handleClose, saveAccount, selectedRow, openCreateEditPopup} =
      accountStore;

  const validationSchema = Yup.object ({
    accountName:Yup.string ()
        .trim ()
        .required (t ("validation.required")),
    // .min (3, t ("validation.minLength", {min:3}))
    // .max (50, t ("validation.maxLength", {max:50})),
    password:Yup.string ()
        .trim ()
        .required (t ("validation.required")),
    // .min (6, t ("validation.minLength", {min:6}))
    // .max (100, t ("validation.maxLength", {max:100})),
    unitPrice:Yup.number ()
        .nullable ()
        .min (0, t ("validation.min", {min:0}))
        .when ("accountCategory.type", {
          is:AccountCategoryType.UNIT_PRICE_AND_QUANTITY.value,
          then:(schema) =>
              schema
                  .required (t ("validation.required"))
                  .positive (t ("validation.positive")),
          otherwise:(schema) => schema.notRequired ().nullable (),
        }),

    price:Yup.number ()
        .nullable ()
        .min (0, t ("validation.min", {min:0}))
        .when ("accountCategory.type", {
          is:AccountCategoryType.UNIT_PRICE_AND_QUANTITY.value,
          then:(schema) =>
              schema
                  .required (t ("validation.required"))
                  .positive (t ("validation.positive")),
          otherwise:(schema) => schema.notRequired ().nullable (),
        }),
    totalAmount:Yup.number ()
        .nullable ()
        .min (0, t ("validation.min", {min:0}))
        .when ("accountCategory.type", {
          is:AccountCategoryType.TOTAL_AMOUNT_ONLY.value,
          then:(schema) =>
              schema
                  .required (t ("validation.required"))
                  .positive (t ("validation.positive")),
          otherwise:(schema) => schema.notRequired ().nullable (),
        }),
    warrantyPeriod:Yup.number ()
        .nullable ()
        .required (t ("validation.required"))
        .integer (t ("validation.integer"))
        .min (5, t ("validation.minMinutes", {min:0})),
    twoFactor:Yup.string ().trim ().nullable (),
    accountCategory:Yup.object ().nullable ().required (t ("validation.required")),
    description:Yup.string ().trim ().nullable (),
  });

  async function handleSaveForm (values) {
    await saveAccount (values);
  }

  return (
      <CommonPopupV2
          size="lg"
          scroll="body"
          open={openCreateEditPopup}
          noDialogContent
          title={
              (selectedRow?.id
                  ? t ("general.button.edit")
                  : t ("general.button.add")) + " " + t ("tài khoản")
          }
          onClosePopup={handleClose}
          isCreate={!selectedRow?.id}
      >
        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={selectedRow}
            onSubmit={handleSaveForm}
        >
          {({isSubmitting, values, setFieldValue}) => (
              <Form autoComplete="off">
                <DialogContent className="px-8 py-6 bg-white rounded-xl shadow-inner">
                  <div className="grid grid-cols-12 gap-6">
                    {/* accountName */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonTextField
                          label="Tên tài khoản"
                          name="accountName"
                          required
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                      />
                    </div>

                    {/* password */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonTextField
                          label="Mật khẩu"
                          name="password"
                          type="password"
                          required
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                      />
                    </div>
                    {/* accountCategory */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonPagingAutocomplete
                          label="Loại tài khoản"
                          name="accountCategory"
                          api={pagingAccountCategory}
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                          required
                          handleOnChange={(value) => {
                            setFieldValue ("accountCategory", value)
                            if (value?.type === AccountCategoryType.TOTAL_AMOUNT_ONLY.value) {
                              setFieldValue ("unitPrice", 1)
                            } else {
                              setFieldValue ("unitPrice", null)
                              setFieldValue ("description", null)
                            }
                            setFieldValue ("price", null)
                            setFieldValue ("totalAmount", null)
                          }}
                      />
                    </div>
                    {/* unitPrice */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonNumberInput
                          label="Số lượng(Xu roblox)"
                          name="unitPrice"
                          required
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue ("unitPrice", value);
                            setFieldValue ("totalAmount", value * (values?.price || 0));
                          }}
                          disabled={selectedRow?.status === AccountStatus.SOLD.value || !values?.accountCategory?.id || values?.accountCategory?.type === AccountCategoryType.TOTAL_AMOUNT_ONLY.value}
                      />
                    </div>

                    {/* price */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonVNDCurrencyInput
                          label="Đơn giá"
                          name="price"
                          required
                          onChange={(e) => {
                            const price = e.target.value;
                            setFieldValue ("price", price);
                            setFieldValue ("totalAmount", price * (values?.unitPrice || 0));
                          }}
                          disabled={selectedRow?.status === AccountStatus.SOLD.value || !values?.accountCategory?.id}
                      />
                    </div>

                    {/* totalAmount */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonVNDCurrencyInput
                          label="Thành tiền"
                          name="totalAmount"
                          disabled
                      />
                    </div>

                    {/* warrantyPeriod */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonNumberInput
                          label="Thời gian bảo hành (phút)"
                          name="warrantyPeriod"
                          required
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                      />
                    </div>

                    {/* twoFactor */}
                    <div className="col-span-12 md:col-span-6">
                      <CommonTextField
                          label="Thông tin 2FA"
                          name="twoFactor"
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                      />
                    </div>

                    {/* premium */}
                    <div className="col-span-612 md:col-span-6 flex items-center space-x-3">
                      <CommonCheckBox
                          label="Premium"
                          name="premium"
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                      />
                    </div>

                    {/* warrantyIssued */}
                    <div className="col-span-12 md:col-span-6 flex items-center space-x-3">
                      <CommonCheckBox
                          label="Đã phát hành bảo hành"
                          name="warrantyIssued"
                          disabled={selectedRow?.status === AccountStatus.SOLD.value}
                      />
                    </div>
                    {values?.accountCategory?.type === AccountCategoryType.TOTAL_AMOUNT_ONLY.value && (
                        <div className="col-span-12">
                          <CommonTextField
                              multiline
                              minRows={3}
                              label="Mô tả"
                              name="description"
                              disabled={selectedRow?.status === AccountStatus.SOLD.value}
                          />
                        </div>
                    )}
                  </div>
                </DialogContent>

                <DialogActions className="px-8 py-4 bg-gray-50 rounded-b-xl border-t">
                  <div className="flex justify-end w-full space-x-3">
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
                    {selectedRow?.status !== AccountStatus.SOLD.value && (
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
                    )}
                  </div>
                </DialogActions>
              </Form>
          )}
        </Formik>
      </CommonPopupV2>
  );
}

export default memo (observer (AccountForm));
