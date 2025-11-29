import React, { memo, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import CommonPopupV2 from "../../common/CommonPopupV2";
import { Button, DialogActions, DialogContent } from "@mui/material";
import { observer } from "mobx-react-lite";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CommonVNDCurrencyInput from "../../common/Form/CommonVNDCurrencyInput";
import CommonNumberInput from "../../common/Form/CommonNumberInput";

function WalletForm () {
  const {t} = useTranslation ();
  const {walletStore, transactionStore} = useStore ();
  const [otpSent, setOtpSent] = useState (false);
  const [isGettingOtp, setIsGettingOtp] = useState (false);
  const [countdown, setCountdown] = useState (0);

  const {
    handleClose,
    selectedRow,
    openWithdrawWalletPopup,
    handleGetOptWithdrawWallet,
    handleWithdrawTransaction
  } = walletStore;

  // Countdown timer effect
  useEffect (() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval (() => {
        setCountdown ((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && otpSent) {
      // OTP expired
      setOtpSent (false);
    }
    return () => clearInterval (timer);
  }, [countdown, otpSent]);

  const validationSchema = Yup.object ({
    amount:Yup.number ()
        .nullable ()
        .min (100000, t ("Số tiền tối thiểu là 10.000đ"))
        .max (selectedRow?.balance || 0, t ("Số tiền vượt quá số dư khả dụng"))
        .required (t ("validation.required")),
    otp:Yup.string ()
        .nullable ()
        .required (t ("validation.required"))
        .length (6, t ("Mã OTP phải có 6 ký tự")),
  });

  async function handleGetOtp (values) {
    if (!values.amount || values.amount < 100000) {
      return;
    }

    setIsGettingOtp (true);
    try {
      await handleGetOptWithdrawWallet (values);
      setOtpSent (true);
      setCountdown (120); // 2 minutes (120 seconds) countdown - đủ thời gian chờ mail
    } catch (error) {
      console.error (error);
    } finally {
      setIsGettingOtp (false);
    }
  }

  async function handleSaveForm (values) {
    const response = await handleWithdrawTransaction (values);
    if (!response) {
      return;
    }
    setOtpSent (false);
    setCountdown (0);
  }

  function handleCloseForm () {
    setOtpSent (false);
    setCountdown (0);
    handleClose ();
  }

  // Format countdown display
  const formatCountdown = (seconds) => {
    const mins = Math.floor (seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString ().padStart (2, '0')}`;
  };

  const titleWithIcon = (
      <div className="flex items-center gap-2">
        <SendIcon className="text-indigo-600" style={{fontSize:24}}/>
        <span>{t ("Yêu cầu rút tiền")}</span>
      </div>
  );

  return (
      <CommonPopupV2
          size="sm"
          scroll="body"
          open={openWithdrawWalletPopup}
          noDialogContent
          title={titleWithIcon}
          onClosePopup={handleCloseForm}
          isCreate={false}
          noIcon={true}
          isEdit={false}
      >
        <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={{amount:100000, otp:""}}
            onSubmit={handleSaveForm}
        >
          {({isSubmitting, values, setFieldValue, errors, touched}) => {
            const isAmountValid = values.amount >= 100000 && values.amount <= (selectedRow?.balance || 0);

            return (
                <Form autoComplete="off">
                  <DialogContent className="p-6">
                    {/* Balance Info */}
                    <div
                        className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                      <p className="text-xs text-gray-600 mb-1">{t ("Số dư khả dụng")}</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {selectedRow?.balance?.toLocaleString () || "0"}₫
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Amount Input */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t ("Số tiền rút")} <span className="text-red-500">*</span>
                        </label>
                        <CommonVNDCurrencyInput
                            name="amount"
                            required
                            placeholder={t ("Nhập số tiền (tối thiểu 10.000₫)")}
                            disabled={otpSent}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {t ("Tối thiểu: 10.000₫ | Tối đa:")} {selectedRow?.balance?.toLocaleString () || "0"}₫
                        </p>
                      </div>

                      {/* Get OTP Button */}
                      {!otpSent && (
                          <Button
                              fullWidth
                              variant="contained"
                              onClick={() => handleGetOtp (values)}
                              disabled={!isAmountValid || isGettingOtp}
                              className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-xl !py-3 !text-base !font-medium !normal-case"
                              startIcon={<VerifiedUserIcon/>}
                          >
                            {isGettingOtp? t ("Đang gửi...") : t ("Lấy mã OTP")}
                          </Button>
                      )}

                      {/* OTP Input with Countdown */}
                      {otpSent && countdown > 0 && (
                          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <VerifiedUserIcon className="text-green-600" style={{fontSize:20}}/>
                                <span className="text-sm font-medium text-green-700">
                            {t ("Mã OTP đã được gửi")}
                          </span>
                              </div>
                              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg">
                                <span className="text-xs text-gray-500">{t ("Còn lại:")}</span>
                                <span className="text-sm font-bold text-indigo-600">
                            {formatCountdown (countdown)}
                          </span>
                              </div>
                            </div>
                            <CommonNumberInput
                                label={t ("Nhập mã OTP")}
                                name="otp"
                                required
                                notDelay
                                placeholder={t ("Nhập 6 số")}
                                maxValue={999999}
                            />
                            <button
                                type="button"
                                onClick={() => handleGetOtp (values)}
                                disabled={isGettingOtp || countdown > 0}
                                className={`text-xs font-medium mt-2 ${
                                    countdown > 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-indigo-600 hover:text-indigo-700 cursor-pointer'
                                }`}
                            >
                              {countdown > 0
                                  ? t (`Gửi lại sau ${formatCountdown (countdown)}`)
                                  : t ("Gửi lại mã OTP")}
                            </button>
                          </div>
                      )}

                      {/* OTP Expired Message */}
                      {otpSent && countdown === 0 && (
                          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                              <VerifiedUserIcon className="text-red-600" style={{fontSize:20}}/>
                              <span className="text-sm font-medium text-red-700">
                          {t ("Mã OTP đã hết hạn")}
                        </span>
                            </div>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleGetOtp (values)}
                                disabled={isGettingOtp}
                                className="!border-red-500 !text-red-600 hover:!bg-red-50 !rounded-lg !normal-case"
                                startIcon={<VerifiedUserIcon/>}
                            >
                              {isGettingOtp? t ("Đang gửi...") : t ("Lấy mã OTP mới")}
                            </Button>
                          </div>
                      )}

                      {/* Note */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-yellow-800">
                          ⓘ {t ("Vui lòng kiểm tra kỹ thông tin trước khi xác nhận rút tiền")}
                        </p>
                      </div>
                    </div>
                  </DialogContent>

                  <DialogActions className="px-6 pb-6 pt-0">
                    <div className="flex gap-3 w-full">
                      <Button
                          fullWidth
                          variant="outlined"
                          disabled={isSubmitting}
                          onClick={handleCloseForm}
                          className="!rounded-xl !py-2.5 !text-gray-700 !border-gray-300 hover:!bg-gray-50 !normal-case"
                          startIcon={<CloseIcon/>}
                      >
                        {t ("general.button.close")}
                      </Button>
                      <Button
                          fullWidth
                          variant="contained"
                          type="submit"
                          disabled={isSubmitting || !otpSent || !values.otp || countdown === 0}
                          className="!bg-indigo-600 hover:!bg-indigo-700 !rounded-xl !py-2.5 !normal-case"
                          startIcon={<SendIcon/>}
                      >
                        {isSubmitting? t ("Đang xử lý...") : t ("Xác nhận rút tiền")}
                      </Button>
                    </div>
                  </DialogActions>
                </Form>
            );
          }}
        </Formik>
      </CommonPopupV2>
  );
}

export default memo (observer (WalletForm));