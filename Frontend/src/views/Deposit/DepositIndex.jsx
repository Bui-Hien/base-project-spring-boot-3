import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import { Form, Formik, useFormikContext } from "formik";
import CommonVNDCurrencyInput from "../../common/Form/CommonVNDCurrencyInput";
import { CircularProgress } from "@mui/material";
import * as Yup from "yup";
import AlertDialog from "../../common/CommonConfirmationDialog";

const DepositIndex = observer (() => {
  const {paymentStore} = useStore ();
  const {t} = useTranslation ();
  const {handleGetUrlVietQr, resetStore} = paymentStore;

  const handleSubmit = async (values) => {
    await handleGetUrlVietQr (values.amount);
  };

  const validationSchema = Yup.object ({
    amount:Yup.number ()
        .nullable ()
        .min (100000, "Số tiền tối thiểu là 100.000đ")
        .max (10000000, "Số tiền tối đa là 10.000.000đ")
        .required (t ("validation.required")),
  });

  useEffect (() => {
    return resetStore;
  }, []);

  return (
      <div className="bg-slate-50 min-h-screen">
        <CommonBreadcrumb routeSegments={[{name:t ("navigation.deposit")}]}/>

        <div className="mx-2 sm:mx-4 bg-white shadow-md rounded-md my-4">
          <Formik
              enableReinitialize
              validationSchema={validationSchema}
              initialValues={{amount:100000}}
              onSubmit={handleSubmit}
          >
            <Form autoComplete="off" className="w-full">
              <ValueForm/>
            </Form>
          </Formik>
        </div>
      </div>
  );
});

const ValueForm = observer (() => {
  const {t} = useTranslation ();
  const {paymentStore} = useStore ();
  const {values} = useFormikContext ();

  const {
    handleGetUrlVietQr,
    paymentUrl,
    loading,
    openClientConfirmDeposit,
    isConfirmedDeposit,
    handleClientConfirmDeposit,
    handleOpenClientConfirmDeposit
  } = paymentStore;


  useEffect (() => {
    if (values?.amount >= 100000) {
      handleGetUrlVietQr (values.amount);
    }
  }, [values?.amount, handleGetUrlVietQr]);

  return (
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 p-4 flex flex-col justify-between h-full">
          <div>
            <label className="text-gray-700 font-medium text-sm mb-1 block">
              {t ("Số tiền cần nạp")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <CommonVNDCurrencyInput
                name="amount"
                required
                placeholder={t ("Nhập số tiền (tối thiểu 100.000₫)")}
            />
            <p className="text-xs text-gray-500 mt-1 italic">
              {t ("Hệ thống sẽ tự động cập nhật mã QR sau khi bạn nhập số tiền")}
            </p>
          </div>

          <div className="mt-4">
            <button
                type="button"
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg
             shadow-md hover:bg-blue-700 active:scale-95 transition-transform duration-150
             disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed disabled:shadow-none"
                onClick={() => handleOpenClientConfirmDeposit(true)}
                disabled={isConfirmedDeposit}
            >
              {t("Xác nhận đã nạp tiền")}
            </button>
          </div>
        </div>
        <div
            className="col-span-12 md:col-span-8 flex flex-col items-center justify-center border-l border-gray-200 p-4">
          {paymentUrl? (
              <>
                <h3 className="text-base font-semibold mb-3 text-gray-700">
                  {t ("Quét mã để thanh toán nhanh qua VietQR")}
                </h3>

                {/* QR wrapper có overlay spinner */}
                <div
                    className="relative p-3 border rounded-2xl shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-300">
                  <img
                      src={paymentUrl}
                      alt="VietQR"
                      className="rounded-xl shadow-md border w-[300px] h-auto object-contain"
                  />
                  {loading && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-2xl">
                        <CircularProgress size={40}/>
                      </div>
                  )}
                </div>
              </>
          ) : (
              <p className="text-gray-500 text-sm italic">
                {t ("Vui lòng nhập số tiền để hiển thị mã QR")}
              </p>
          )}
        </div>
        {openClientConfirmDeposit && (
            <AlertDialog
                open={openClientConfirmDeposit}
                onConfirmDialogClose={() => handleOpenClientConfirmDeposit (false)}
                onYesClick={handleClientConfirmDeposit}
                title={t ("Xác nhận nạp tiền")}
                text={t ("Bạn có chắc chắn rằng giao dịch nạp tiền này đã được thực hiện thành công?")}
                agree={t ("Xác nhận")}
                cancel={t ("Hủy bỏ")}
            />
        )}
      </div>
  );
});

export default memo (DepositIndex);
