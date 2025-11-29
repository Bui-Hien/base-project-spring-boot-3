import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CommonTextField from "../../common/Form/CommonTextField";
import AccountFilter from "./AccountFilter";
import FilterListIcon from "@mui/icons-material/FilterList";
import { observer } from "mobx-react-lite";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function AccountToolbar ({isAdmin}) {
  const {accountStore} = useStore ();
  const {t} = useTranslation ();

  const {
    handleDeleteList,
    pagingAccount,
    handleOpenCreateEdit,
    searchObject,
    selectedDataList,
    handleSetSearchObject,
    handleTogglePopupFilter,
    isOpenFilter,
    handleOpenAccountStatusNew,
    handleOpenAccountStatusErr,
  } = accountStore;

  async function handleFilter (values) {
    const newSearchObject = {
      ... values,
      pageIndex:1,
    };
    handleSetSearchObject (newSearchObject);
    await pagingAccount ();
  }

  return (
      <Formik enableReinitialize initialValues={searchObject} onSubmit={handleFilter}>
        {({resetForm, values, setFieldValue, setValues}) => (

            <Form
                autoComplete="off"
                className="w-full my-2 py-3 bg-transparent border-0 shadow-none"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* === Action Buttons (Trái) === */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenCreateEdit (null)}
                      startIcon={<AddIcon/>}
                      className="!bg-blue-600 hover:!bg-blue-700 !shadow-sm !rounded-lg"
                  >
                    {t ("general.button.add")}
                  </Button>
                  {selectedDataList?.length > 0 && isAdmin && (
                      <>
                        {/*<Button*/}
                        {/*    variant="outlined"*/}
                        {/*    onClick={() => handleOpenAccountStatusNew ()}*/}
                        {/*    startIcon={<CheckCircleOutlineIcon/>}*/}
                        {/*    className="!border-green-400 !text-green-700 hover:!bg-green-50 !rounded-lg"*/}
                        {/*>*/}
                        {/*  {t ("Xác nhận")}*/}
                        {/*</Button>*/}

                        <Button
                            variant="outlined"
                            onClick={() => handleOpenAccountStatusErr ()}
                            startIcon={<ErrorOutlineIcon/>}
                            className="!border-amber-400 !text-amber-700 hover:!bg-amber-50 !rounded-lg"
                        >
                          {t ("Lỗi")}
                        </Button>
                      </>
                  )}
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
                    {t ("general.button.delete") || "Xóa"}
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
                    {isAdmin && (
                        <Button
                            variant="outlined"
                            onClick={handleTogglePopupFilter}
                            startIcon={
                              <FilterListIcon
                                  className={`transform transition-transform duration-300 ${
                                      isOpenFilter? "rotate-180 text-blue-500" : "text-gray-500"
                                  }`}
                              />
                            }
                            className="!rounded-lg !border-gray-300 hover:!bg-gray-100"
                        >
                          {t ("general.button.filter") || "Bộ lọc"}
                        </Button>
                    )}
                  </div>
                </div>
              </div>
              <div
                  className={`transition-all duration-300 ${
                      isOpenFilter? "mt-5 opacity-100" : "opacity-0 hidden"
                  }`}
              >
                <AccountFilter handleFilter={handleFilter} isAdmin={isAdmin}/>
              </div>
            </Form>
        )}
      </Formik>
  );
}

export default memo (observer (AccountToolbar));
