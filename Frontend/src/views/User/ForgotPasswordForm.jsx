import React, { memo, useEffect } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import ConstantList, { HOME_PAGE, LOGIN_PAGE } from "../../appConfig";

function ForgotPasswordForm () {
  const {t} = useTranslation ();
  const {userStore} = useStore ();
  const {resetStore, handleForgotPassword, selectedRow} = userStore;
  const navigate = useNavigate ();

  const validationSchema = Yup.object ().shape ({
    email:Yup.string ()
        .email ("Địa chỉ email không hợp lệ")
        .nullable ()
        .required ("Đây là trường bắt buộc."),
  });

  const handleSubmitForm = async (values) => {
    const success = await handleForgotPassword (values);
    if (success) {
      navigate (LOGIN_PAGE, {state:{from:ConstantList.FORGOT_PASSWORD}});
    }
  };

  useEffect (() => resetStore, []);

  return (
      <div
          className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
        <div
            className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-2xl border border-gray-200 transition-all duration-300 hover:shadow-blue-200">
          <Formik
              validationSchema={validationSchema}
              enableReinitialize
              initialValues={selectedRow || {}}
              onSubmit={handleSubmitForm}
          >
            {({isSubmitting}) => (
                <Form autoComplete="off" className="space-y-6">
                  {/* Title */}
                  <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                      {t ("Quên mật khẩu")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Nhập email để đặt lại mật khẩu
                    </p>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                    <CommonTextField
                        label={t ("Email")}
                        name="email"
                        type="email"
                        required
                        className="focus:ring-2 focus:ring-blue-500 rounded-lg"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => navigate (HOME_PAGE)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium disabled:opacity-50 transition-all duration-200"
                    >
                      {t ("Trang chủ")}
                    </button>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => navigate (LOGIN_PAGE, {state:{from:ConstantList.FORGOT_PASSWORD}})}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium disabled:opacity-50 transition-all duration-200"
                    >
                      {t ("Đăng nhập")}
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                    >
                      {t ("Gửi yêu cầu")}
                    </button>
                  </div>
                </Form>
            )}
          </Formik>
        </div>
      </div>
  );
}

export default memo (observer (ForgotPasswordForm));