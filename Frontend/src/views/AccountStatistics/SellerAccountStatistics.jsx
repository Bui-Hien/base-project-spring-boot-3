import React, { memo, useEffect } from 'react';
import OrderStatsGrid from "./Component/OrderStatsGrid";
import DashboardStatsGrid from "./Component/DashboardStatsGrid";
import DashboardCharts from "./Component/DashboardCharts";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import CommonDateTimePicker from "../../common/Form/CommonDateTimePicker";
import SearchIcon from "@mui/icons-material/Search";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import {Tooltip} from "@mui/material";

const SellerAccountStatistics = () => {
  const {t} = useTranslation ();
  const {accountStatisticsStore} = useStore ();

  const {
    searchObject,
    intactSearchObject,
    overallStatistics,
    handleGetOverallStatistics,
    handleGetRevenue,
    handleSetSearchObject,
    resetStore
  } = accountStatisticsStore;

  useEffect (() => {
    handleGetOverallStatistics ();
    handleGetRevenue ();

    return () => {
      resetStore ();
    }
  }, []);

  const handleFilter = async (values) => {
    const newSearchObject = {
      ... values,
      pageIndex:1,
    };
    handleSetSearchObject (newSearchObject);

    await Promise.all ([
      handleGetOverallStatistics (),
      handleGetRevenue (),
    ]);
  }

  const handleResetFilter = async () => {
    const newSearchObject = {
      ... JSON.parse (JSON.stringify (intactSearchObject)),
    };
    await handleFilter (newSearchObject);
  }
  return (
      <div className="min-h-screen bg-gray-50">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.sellerManagement.title")},
            {name:t ("navigation.sellerManagement.dashboard")},
          ]}/>
        </div>
        <div className="max-w-8xl mx-auto p-4">
          {/* Bộ lọc thời gian */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <Formik enableReinitialize initialValues={searchObject} onSubmit={handleFilter}>
              {({resetForm, values, setFieldValue, setValues}) => (
                  <Form autoComplete="off" className="w-full">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 md:col-span-6 flex flex-col gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Kỳ báo cáo:
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <CommonDateTimePicker
                              name="fromDate"
                              label="Từ ngày"
                          />
                          <CommonDateTimePicker
                              name="toDate"
                              label="Đến ngày"
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 flex items-end gap-3 justify-end">
                        <div className="flex items-center gap-2">
                          {/* Nút tìm kiếm */}
                          <Tooltip title={t("general.button.search") || "Tìm"} placement="top">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <SearchIcon fontSize="small" />
                              <span className="hidden sm:inline">
                                {t("general.button.search") || "Tìm kiếm"}
                              </span>
                            </button>
                          </Tooltip>

                          {/* Nút đặt lại */}
                          <Tooltip title={t("general.button.filter") || "Đặt lại"} placement="top">
                            <button
                                onClick={handleResetFilter}
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-gray-50 text-gray-600
                   hover:bg-gray-100 hover:text-gray-700
                   transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <RotateLeftIcon fontSize="small" />
                              <span className="hidden sm:inline">
                                {t("general.button.reset") || "Đặt lại"}
                              </span>
                            </button>
                          </Tooltip>
                        </div>
                      </div>

                    </div>
                  </Form>
              )}
            </Formik>
          </div>
          {/* Stat Cards */}
          <DashboardStatsGrid
              totalRevenue={overallStatistics.totalRevenue}
              totalOrders={overallStatistics.totalOrders}
              successfulOrders={overallStatistics.successfulOrders}
              successRate={overallStatistics.successRate}
          />

          {/* Charts Row */}
          <DashboardCharts/>
          {/* Quick Stats Grid */}
          <OrderStatsGrid
              successfulOrders={overallStatistics.successfulOrders}
              errorOrders={overallStatistics.errorOrders}
              refundedOrders={overallStatistics.refundedOrders}
              processingOrders={overallStatistics.processingOrders}
          />
        </div>
      </div>
  );
};

export default memo (observer (SellerAccountStatistics));