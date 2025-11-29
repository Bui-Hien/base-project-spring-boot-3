import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";

function InstructToolbar () {
  const {postStore} = useStore ();
  const {t} = useTranslation ();
  const {
    pagingPostPublic,
    searchObject,
    handleSetSearchObject,
  } = postStore;

  async function handleFilter (values) {
    const newSearchObject = {
      ... values,
      pageIndex:1,
    };
    handleSetSearchObject (newSearchObject);
    await pagingPostPublic ();
  }

  return (
      <Formik enableReinitialize initialValues={searchObject} onSubmit={handleFilter}>
        {({resetForm, values, setFieldValue, setValues}) => (
            <Form autoComplete="off" className="w-full border-b border-gray-200 py-4">
              <div className="grid grid-cols-12 gap-4 items-end">
                {/* Header Section */}
                <div className="col-span-12 md:col-span-6">
                  <p className="mt-1 text-md text-gray-600">
                    Danh sách các tài liệu và hướng dẫn sử dụng
                  </p>
                </div>

                {/* Search Section */}
                <div className="col-span-12 md:col-span-6 flex flex-col sm:flex-row items-center justify-end gap-3">
                  {/* Ô nhập tìm kiếm */}
                  <div className="relative w-full sm:max-w-sm">
                    <CommonTextField
                        name="keyword"
                        placeholder={t("general.enterSearch") || "Nhập từ khóa tìm kiếm"}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        InputProps={{
                          classes: {
                            input: "pl-8",
                          },
                        }}
                    />
                  </div>

                  {/* Nút tìm kiếm */}
                  <Button
                      type="submit"
                      startIcon={<SearchIcon />}
                      className="!bg-blue-600 hover:!bg-blue-700 !text-white !rounded-lg shadow-sm px-5 py-2 transition-all w-full sm:w-auto"
                  >
                    {t("general.button.search") || "Tìm kiếm"}
                  </Button>
                </div>
              </div>
            </Form>
        )}
      </Formik>
  );
}

export default memo (observer (InstructToolbar));