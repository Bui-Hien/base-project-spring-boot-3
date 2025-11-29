import React, { memo } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useStore } from "../../stores";
import { Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { observer } from "mobx-react-lite";
import CommonDateTimePicker from "../../common/Form/CommonDateTimePicker";
import { ListSystemStatisticTab } from "../../LocalConstants";
import EditIcon from "@mui/icons-material/Edit";

function SystemStatisticToolbar () {
  const {systemStatisticStore} = useStore ();
  const {t} = useTranslation ();

  const {
    handleGetYearlyStatisticsList,
    handleGetMonthlyStatisticsList,
    handleGetDailyStatisticsChartList,
    searchObject,
    handleSetSearchObject,
    currentTab,
    handleOpenCreateEdit
  } = systemStatisticStore;

  async function handleFilter (values) {
    const newSearchObject = {
      ... values,
    };
    handleSetSearchObject (newSearchObject);
    if (currentTab === ListSystemStatisticTab.DAILY.value) {
      await handleGetDailyStatisticsChartList ();
    } else if (currentTab === ListSystemStatisticTab.MONTHLY.value) {
      await handleGetMonthlyStatisticsList ();
    } else {
      await handleGetYearlyStatisticsList ();
    }
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
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 mb-2">

                {/* === Left buttons === */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenCreateEdit (null)}
                      startIcon={<EditIcon/>}
                      className="!bg-blue-600 hover:!bg-blue-700 !shadow-md !rounded-lg"
                  >
                    {t ("general.button.edit")}
                  </Button>

                </div>

                {/* === Right date filter + search === */}
                <div className="flex flex-wrap items-center justify-end gap-3 w-full max-w-xl">
                  {/* Bộ chọn thời gian theo tab */}
                  {currentTab === ListSystemStatisticTab.DAILY.value && (
                      <CommonDateTimePicker
                          name="date"
                          views={["year", "month", "day"]}
                          maxDate={new Date ()}
                          className="w-full sm:w-auto"
                          format={"dd/MM/yyyy"}
                      />
                  )}

                  {currentTab === ListSystemStatisticTab.MONTHLY.value && (
                      <CommonDateTimePicker
                          name="date"
                          views={["year", "month"]}
                          maxDate={new Date ()}
                          className="w-full sm:w-auto"
                          format={"MM/yyyy"}
                      />
                  )}

                  {currentTab === ListSystemStatisticTab.YEARLY.value && (
                      <CommonDateTimePicker
                          name="date"
                          views={["year"]}
                          maxDate={new Date ()}
                          className="w-full sm:w-auto"
                          format={"yyyy"}
                      />
                  )}

                  {/* Nút tìm kiếm */}
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
            </Form>
        )}
      </Formik>
  );

}

export default memo (observer (SystemStatisticToolbar));
