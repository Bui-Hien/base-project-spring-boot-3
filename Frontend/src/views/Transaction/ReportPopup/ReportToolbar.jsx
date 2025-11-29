import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { observer } from "mobx-react-lite";
import CommonTextField from "../../../common/Form/CommonTextField";
import { useStore } from "../../../stores";

function ReportToolbar () {
  const {reportStore} = useStore ();
  const {t} = useTranslation ();

  const {
    pagingReport,
    searchObject,
    handleSetSearchObject,
  } = reportStore;

  async function handleFilter (values) {
    const newSearchObject = {
      ... values,
      pageIndex:1,
    };
    handleSetSearchObject (newSearchObject);
    await pagingReport ();
  }

  return (
      <Formik enableReinitialize initialValues={searchObject} onSubmit={handleFilter}>
        {({resetForm, values, setFieldValue, setValues}) => (
            <Form
                autoComplete="off"
                className="w-full py-3 px-4 sm:px-0 bg-transparent border-0 shadow-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                </div>

                {/* === Search Section === */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 flex-1">
                  {/* Ô nhập từ khóa */}
                  <div className="relative w-full sm:max-w-sm">
                    <CommonTextField
                        name="keyword"
                        placeholder={t ("Nhập từ khóa tìm kiếm")}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        InputProps={{
                          classes:{
                            input:"pl-8",
                          },
                        }}
                    />
                  </div>

                  {/* Nút tìm kiếm */}
                  <Button
                      type="submit"
                      startIcon={<SearchIcon/>}
                      className="!bg-blue-600 hover:!bg-blue-700 !text-white !rounded-lg shadow-sm px-5 py-2 transition-all w-full sm:w-auto"
                  >
                    {t ("general.button.search") || "Tìm kiếm"}
                  </Button>
                </div>
              </div>
            </Form>
        )}
      </Formik>
  );

}

export default memo (observer (ReportToolbar));
