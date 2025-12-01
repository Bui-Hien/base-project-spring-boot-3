import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import CommonTextField from "../../common/Form/CommonTextField";
import i18next from "i18next";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import ConstantList from "../../appConfig";
import { Home, LogIn } from 'lucide-react';

export default observer (function LoginIndex () {
  const {authStore} = useStore ();
  const navigate = useNavigate ();
  const location = useLocation ();
  const {loginObject, resetStore, handleLogin} = authStore;

  const validationSchema = Yup.object ({
    username:Yup.string ()
        .required ("Vui lòng nhập tên đăng nhập")
        .nullable (),
    password:Yup.string ()
        .required ("Vui lòng nhập mật khẩu")
        .nullable (),
  });

  const handleSubmitForm = async (values) => {
    const success = await handleLogin (values);
    if (success) {
      if (
          location.state?.from === ConstantList.FORGOT_PASSWORD ||
          location.state?.from === ConstantList.REGISTER ||
          location.state?.from === ConstantList.RESET_PASSWORD
      ) {
        navigate (ConstantList.HOME_PAGE);
      } else {
        navigate (-1);
      }
    }
  };

  useEffect (() => {
    return resetStore;
  }, [resetStore]);

  return (
      <div
          className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
        <div className="w-full max-w-md">
          <div
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-blue-200">
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={loginObject}
                onSubmit={handleSubmitForm}
            >
              {({isSubmitting}) => (
                  <Form autoComplete="off" className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 rounded-full p-4">
                          <LogIn className="w-10 h-10 text-blue-600"/>
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {i18next.t ("Đăng nhập")}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Chào mừng bạn quay trở lại
                      </p>
                    </div>

                    <div className="space-y-5">
                      <CommonTextField
                          label={i18next.t ("Tên đăng nhập")}
                          name="username"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                      <CommonTextField
                          label={i18next.t ("Mật khẩu")}
                          type="password"
                          name="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                          type="button"
                          onClick={() => navigate (ConstantList.FORGOT_PASSWORD)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                      >
                        {i18next.t ("Quên mật khẩu?")}
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-5 h-5"/>
                        {isSubmitting? i18next.t ("Đang đăng nhập...") : i18next.t ("Đăng nhập")}
                      </button>

                      <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => navigate (ConstantList.HOME_PAGE)}
                          className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Home className="w-4 h-4"/>
                        <span className="text-sm">{i18next.t ("Trang chủ")}</span>
                      </button>
                    </div>
                  </Form>
              )}
            </Formik>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            {i18next.t ("Chưa có tài khoản?")}{" "}
            <button
                type="button"
                onClick={() => navigate (ConstantList.REGISTER)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              {i18next.t ("Đăng ký ngay")}
            </button>
          </p>
        </div>
      </div>
  );
});