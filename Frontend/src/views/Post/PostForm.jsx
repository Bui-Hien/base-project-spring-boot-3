import React, { memo, useEffect } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import * as Yup from "yup";
import { observer } from "mobx-react-lite";
import { Button, DialogActions, DialogContent, div } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CommonEditor from "../../common/Form/CommonEditor";
import CloseIcon from "@mui/icons-material/Close";
import CommonTextField from "../../common/Form/CommonTextField";
import CommonSelectInput from "../../common/Form/CommonSelectInput";
import { PostStatus } from "../../LocalConstants";
import { useNavigate, useParams } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FileUpload from "../../common/UploadFile/FileUpload";
import PreviewFileViewer from "../../common/UploadFile/PreviewFileViewer";
import { toast } from "react-toastify";

function PostForm () {
  const {t} = useTranslation ();
  const navigate = useNavigate ();
  const {id} = useParams (); // Lấy id từ URL
  const {postStore,} = useStore ();

  const {
    savePost,
    selectedRow,
    handleGetById
  } = postStore;

  useEffect (() => {
    handleGetById (id);
  }, [id]);

  const validationSchema = Yup.object ({
    title:Yup.string ()
        .trim ()
        .nullable ()
        .required (t ("validation.required")),
    status:Yup.number ().nullable ().required (t ("validation.required")),
    content:Yup.string ().nullable ().required (t ("validation.required")),
  });


  async function handleSaveForm (values) {
    if (!values?.caption?.id) {
      toast.error (t ("post.img-caption"));
      return;
    }
    const response = await savePost (values);
    if (response?.data?.data?.status < 400) {
      navigate ("/admin/post");
    }
  }

  return (
      <Formik
          validationSchema={validationSchema}
          enableReinitialize
          initialValues={{... selectedRow}}
          onSubmit={handleSaveForm}
      >
        {({isSubmitting, values, setFieldValue, initialValues}) => {
          return (
              <Form autoComplete="off" className={"!py-4 px-4"}>
                <DialogContent className="!px-0">
                  {values?.preview? (
                      <div className="p-6 max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                          <h1 className="text-3xl font-bold text-gray-900 flex-grow">
                            {values?.title || ""}
                          </h1>
                        </div>

                        <div className="border-b border-gray-200 mb-6"/>

                        <div className="flex items-center gap-6 mb-6">
                          <p className="text-sm text-gray-600">
                            <span
                                className="font-medium">{t ("post.author-name")}:</span> {values?.author?.displayName || ""}
                          </p>

                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <VisibilityIcon className="text-gray-500" sx={{fontSize:18}}/>
                            <span>{values?.view || 0} {t ("post.view")}</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 my-6"/>

                        {/* Nội dung */}
                        <div className="bg-white rounded-lg">
                          <div
                              className="prose prose-xl max-w-none text-gray-800 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html:values?.content || `<p>${t ("post.no-content")}</p>`
                              }}
                          />
                        </div>
                      </div>
                  ) : (
                      <div className={"grid grid-cols-12 gap-2"}>
                        <div className="col-span-12 md:col-span-4">
                          <CommonTextField
                              required
                              label={t ("post.title")}
                              name="title"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                          <CommonSelectInput
                              hideNullOption
                              name="status"
                              options={PostStatus.getListData ()}
                              label={t ("post.status")}
                              required
                          />
                        </div>

                        <div className="flex items-end col-span-12 md:col-span-4">
                          <label className="block text-lg font-medium text-gray-700 mb-2">
                            {t ("post.caption")}:
                            <span style={{color:"red"}}> * </span>
                          </label>

                          <div className="flex items-center gap-3">
                            <FileUpload
                                onUploadSuccess={async (file) => {
                                  await setFieldValue ("caption", file);
                                }}
                                title={t ("general.button.upload")}
                                multiple={false}
                                isApiPublic={true}

                            />

                            {values?.caption?.id && (
                                <PreviewFileViewer
                                    selectedFile={values?.caption}
                                    disabled={!values?.caption?.id}
                                    title={t ("general.button.view-img")}
                                    isPublic={true}
                                />
                            )}
                          </div>
                        </div>

                        <div className="col-span-12">
                          <CommonEditor
                              label={t ("post.content")}
                              name="content"
                          />
                        </div>
                      </div>
                  )}
                </DialogContent>
                <DialogActions className="!px-0">
                  <div className="flex justify-end">
                    <Button
                        variant="outlined"
                        color="secondary"
                        disabled={isSubmitting}
                        onClick={() => setFieldValue ("preview", !values?.preview)}
                        className="rounded-lg px-4 py-2 !mr-2 border-gray-400 text-gray-700 hover:bg-gray-100 flex items-center"
                        startIcon={values?.preview? <VisibilityOffIcon/> : <VisibilityIcon/>}
                    >
                      {t ("general.button.preview")}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        disabled={isSubmitting}
                        onClick={() => {
                          navigate ("/admin/post");
                        }}
                        className="rounded-lg px-4 py-2 !mr-2 !bg-white-500"
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
  );
}

export default memo (observer (PostForm));
