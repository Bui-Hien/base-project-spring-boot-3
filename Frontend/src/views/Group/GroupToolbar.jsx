import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CommonTextField from "../../common/Form/CommonTextField";
import { observer } from "mobx-react-lite";

function GroupToolbar () {
  const {groupStore} = useStore ();
  const {t} = useTranslation ();

  const {
    handleDeleteList,
    pagingGroup,
    handleOpenCreateEdit,
    searchObject,
    selectedDataList,
    handleSetSearchObject,
  } = groupStore;

  async function handleFilter (values) {
    const newSearchObject = {
      ... values,
      pageIndex:1,
    };
    handleSetSearchObject (newSearchObject);
    await pagingGroup ();
  }

  return (
      <Formik
          enableReinitialize
          initialValues={searchObject}
          onSubmit={handleFilter}
      >
        {({resetForm, values, setFieldValue, setValues}) => (
            <Form
                autoComplete="off"
                className="w-full my-2 py-3 bg-transparent border-0 shadow-none"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* === Action Buttons (Trái) === */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {/* Nút thêm */}
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenCreateEdit (null)}
                      startIcon={<AddIcon/>}
                      className="!bg-blue-600 hover:!bg-blue-700 !shadow-md !rounded-lg"
                  >
                    {t ("general.button.add")}
                  </Button>

                  {/* Nút xóa */}
                  <Button
                      variant="outlined"
                      onClick={handleDeleteList}
                      startIcon={<DeleteIcon/>}
                      disabled={selectedDataList?.length <= 0}
                      className={`!rounded-lg ${
                          selectedDataList?.length > 0
                              ? "!border-red-400 !text-red-600 hover:!bg-red-50"
                              : "!border-gray-200 !text-gray-400"
                      }`}
                  >
                    {t ("general.button.delete")}
                  </Button>
                </div>

                {/* === Search Section (Phải) === */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 flex-1">
                  {/* Ô nhập tìm kiếm có icon */}
                  <div className="">
                    <CommonTextField
                        name="keyword"
                        placeholder={t ("general.keyword") || "Nhập từ khóa tìm kiếm"}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-3 py-2 text-md text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        InputProps={{
                          classes:{input:"pl-8"},
                        }}
                    />
                  </div>

                  {/* Nút tìm kiếm */}
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="contained"
                        type="submit"
                        startIcon={<SearchIcon/>}
                        className="!bg-blue-600 hover:!bg-blue-700 !shadow-md !rounded-lg flex-1 md:flex-none"
                    >
                      {t ("general.button.search")}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
        )}
      </Formik>
  );
}

export default memo (observer (GroupToolbar));
