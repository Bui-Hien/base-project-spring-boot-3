import React, { memo, useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import ConstantList, { HOME_PAGE, LOGIN_PAGE } from "../../appConfig";
import { ArrowRight, Home, LogIn } from 'lucide-react';

function RegisterForm () {
  const {t} = useTranslation ();
  const {userStore} = useStore ();
  const {resetStore, handleRegisterUser, selectedRow} = userStore;
  const [isRegistered, setIsRegistered] = useState (false);
  const [userEmail, setUserEmail] = useState ("");

  const navigate = useNavigate ();

  const validationSchema = Yup.object ().shape ({
    displayName:Yup.string ()
        .nullable ()
        .required ("Vui lòng nhập tên người dùng"),
    email:Yup.string ()
        .nullable ()
        .email ("Địa chỉ email không hợp lệ")
        .required ("Vui lòng nhập email"),
    password:Yup.string ()
        .nullable ()
        .required ("Vui lòng nhập mật khẩu"),
    confirmPassword:Yup.string ()
        .nullable ()
        .required ("Vui lòng xác nhận mật khẩu")
        .oneOf (
            [Yup.ref ("password")],
            "Mật khẩu xác nhận không khớp"
        ),
  });

  const handleSubmitForm = async (values) => {
    const success = await handleRegisterUser (values);
    if (success) {
      setUserEmail (values.email);
      setIsRegistered (true);
    }
  };

  const handleResendEmail = async () => {
    // Logic gửi lại email
    console.log ("Resend email to:", userEmail);
  };

  useEffect (() => {
    return resetStore;
  }, []);

  // Hiển thị UI xác nhận email sau khi đăng ký thành công
  if (isRegistered) {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {t ("Đăng ký thành công!")}
                </h2>
                <p className="text-gray-500 text-sm">
                  {t ("Vui lòng kiểm tra email để xác nhận tài khoản")}
                </p>
              </div>
              {/* Instructions */}
              <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-3">
                <h3 className="font-semibold text-gray-800 text-center mb-4">
                  {t ("Các bước tiếp theo:")}
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div
                        className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <p className="text-gray-600 text-sm pt-0.5">
                      {t ("Mở hộp thư email của bạn")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div
                        className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <p className="text-gray-600 text-sm pt-0.5">
                      {t ("Tìm email từ chúng tôi (kiểm tra cả thư mục spam)")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div
                        className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <p className="text-gray-600 text-sm pt-0.5">
                      {t ("Nhấn vào link xác nhận trong email")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                    type="button"
                    onClick={() => navigate (LOGIN_PAGE, {state:{from:ConstantList.REGISTER}})}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {t ("Đi tới trang đăng nhập")}
                  <ArrowRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  }

  // Form đăng ký

  return (
      <div
          className="flex min-h-screen items-start justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-blue-200">
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={selectedRow}
                onSubmit={handleSubmitForm}
            >
              {({isSubmitting}) => (
                  <Form autoComplete="off" className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {t ("Đăng ký tài khoản")}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Tạo tài khoản mới để bắt đầu
                      </p>
                    </div>

                    {/* Fields */}
                    <div className="space-y-5">
                      <CommonTextField
                          label={t ("Tên người dùng")}
                          name="displayName"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      <CommonTextField
                          label={t ("Email")}
                          name="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      <CommonTextField
                          label={t ("Mật khẩu")}
                          name="password"
                          type="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      <CommonTextField
                          label={t ("Mật khẩu xác nhận")}
                          name="confirmPassword"
                          type="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      {/* Primary Button */}
                      <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting? t ("Đang xử lý...") : t ("Đăng ký")}
                      </button>

                      {/* Secondary Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => navigate (HOME_PAGE)}
                            className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Home className="w-4 h-4"/>
                          <span className="text-sm">{t ("Trang chủ")}</span>
                        </button>

                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => navigate (LOGIN_PAGE, {state:{from:ConstantList.REGISTER}})}
                            className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-4 h-4"/>
                          <span className="text-sm">{t ("Đăng nhập")}</span>
                        </button>
                      </div>
                    </div>
                  </Form>
              )}
            </Formik>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t ("Đã có tài khoản?")}{" "}
            <button
                type="button"
                onClick={() => navigate (LOGIN_PAGE)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              {t ("Đăng nhập ngay")}
            </button>
          </p>
        </div>
      </div>
  );
}

export default memo (observer (RegisterForm));