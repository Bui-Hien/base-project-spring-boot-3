import { useNavigate } from "react-router-dom";
import React, { memo, useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Button, DialogActions, DialogContent } from "@mui/material";
import { observer } from "mobx-react-lite";
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import CommonTextField from "../../../common/Form/CommonTextField";
import { useStore } from "../../../stores";
import ChangePasswordDto from "../../../dto/auth/ChangePasswordDto";

function ChangePasswordTab () {
  const navigate = useNavigate ();
  const {t} = useTranslation ();
  const {userStore} = useStore ();
  const dialogActionsRef = useRef (null);
  const [actionHeight, setActionHeight] = useState (0);

  const {
    handleChangePassword,
  } = userStore;

  // Lấy chiều cao của DialogActions
  useEffect (() => {
    const updateHeight = () => {
      if (dialogActionsRef.current) {
        const height = dialogActionsRef.current.offsetHeight;
        setActionHeight (height);
      }
    };

    // Update height khi component mount
    updateHeight ();

    // Update height khi window resize
    window.addEventListener ('resize', updateHeight);

    // Cleanup
    return () => window.removeEventListener ('resize', updateHeight);
  }, []);

  const validationSchema = () =>
      Yup.object ({
        oldPassword:Yup.string ().nullable ().required (t ("validation.required")),
        password:Yup.string ().nullable ().required (t ("validation.required")),
        confirmPassword:Yup.string ()
            .nullable ()
            .required (t ("validation.required"))
            .oneOf (
                [Yup.ref ("password")],
                t ("Mật khẩu mới và mật khẩu xác nhận không khớp")
            ),

      });

  async function handleSaveForm (values) {
    await handleChangePassword (values);
  }

  return (
      <Formik
          validationSchema={validationSchema}
          enableReinitialize
          initialValues={{... new ChangePasswordDto ()}}
          onSubmit={handleSaveForm}
      >
        {({isSubmitting, values, setFieldValue, initialValues}) => {
          return (
              <Form autoComplete="off" className={"relative"}>
                {/* Thêm padding bottom động dựa trên chiều cao của DialogActions */}
                <DialogContent
                    className="!px-0"
                    style={{paddingBottom:`${actionHeight + 24}px`}}
                >
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-4">
                      <CommonTextField
                          label={"Mật khẩu cũ"}
                          name={"oldPassword"}
                          type={"password"}
                          required
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <CommonTextField
                          label="Mật khẩu mới"
                          name="password"
                          type={"password"}
                          required
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <CommonTextField
                          label="Mật khẩu xác nhận"
                          name="confirmPassword"
                          type={"password"}
                          required
                      />
                    </div>
                  </div>
                </DialogContent>

                {/* Fixed bottom với ref để lấy chiều cao */}
                <DialogActions
                    ref={dialogActionsRef}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10"
                >
                  <div className="px-4 sm:px-6 py-2 flex justify-end w-full gap-2">
                    <Button
                        variant="outlined"
                        color="secondary"
                        disabled={isSubmitting}
                        onClick={() => navigate (-1)}
                        className="rounded-lg px-4 py-2"
                        startIcon={<CloseIcon/>}
                    >
                      {t ("Quay lại")}
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
  );
}

export default memo (observer (ChangePasswordTab));