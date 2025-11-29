import React, { memo, useEffect } from 'react';
import OrderStatsGrid from "./Component/OrderStatsGrid";
import DashboardStatsGrid from "./Component/DashboardStatsGrid";
import { OrderStatsTable } from "./Component/OrderStatsTableComponent";
import DashboardCharts from "./Component/DashboardCharts";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import CommonDateTimePicker from "../../common/Form/CommonDateTimePicker";
import SearchIcon from "@mui/icons-material/Search";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Tooltip } from "@mui/material";
import { formatMoney } from "../../LocalFunction";

const AdminStatisticsDashboard = () => {
  const {t} = useTranslation ();
  const {accountStatisticsStore, walletStore} = useStore ();

  const {
    searchObject,
    intactSearchObject,
    accountStatisticsByUserList,
    totalElements,
    totalPages,
    overallStatistics,
    handleGetAccountStatisticsByUser,
    handleGetOverallStatistics,
    handleGetRevenue,
    setPageIndex,
    setPageSize,
    handleSetSearchObject,
    resetStore
  } = accountStatisticsStore;

  const {totalBalance, handleGetTotalBalanceByUser} = walletStore;
  useEffect (() => {
    handleGetAccountStatisticsByUser ();
    handleGetOverallStatistics ();
    handleGetRevenue ();
    handleGetTotalBalanceByUser ();

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
      handleGetAccountStatisticsByUser (),
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("dashboard.header")}</h1>
              <p className="text-gray-600">{t("dashboard.sub-header")}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500 mb-1">Tổng số dư</p>
              <p className="text-3xl font-bold text-green-600">
                {formatMoney(totalBalance)}
              </p>
            </div>
          </div>

          {/* Bộ lọc thời gian */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <Formik enableReinitialize initialValues={searchObject} onSubmit={handleFilter}>
              {({resetForm, values, setFieldValue, setValues}) => (
                  <Form autoComplete="off" className="w-full">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 md:col-span-6 flex flex-col gap-3">
                        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                          {t ("dashboard.reporting-period")}
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <CommonDateTimePicker
                              name="fromDate"
                              label={t ("dashboard.fromDate")}
                          />
                          <CommonDateTimePicker
                              name="toDate"
                              label={t ("dashboard.toDate")}
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6 flex items-end gap-3 justify-end">
                        <div className="flex items-center gap-2">
                          {/* Nút tìm kiếm */}
                          <Tooltip title={t ("general.button.search") || "Tìm"} placement="top">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <SearchIcon fontSize="small"/>
                              <span className="hidden sm:inline">
                                {t ("general.button.search") || "Tìm kiếm"}
                              </span>
                            </button>
                          </Tooltip>

                          {/* Nút đặt lại */}
                          <Tooltip title={t ("general.button.filter") || "Đặt lại"} placement="top">
                            <button
                                onClick={handleResetFilter}
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                   bg-gray-50 text-gray-600
                   hover:bg-gray-100 hover:text-gray-700
                   transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <RotateLeftIcon fontSize="small"/>
                              <span className="hidden sm:inline">
                                {t ("general.button.reset") || "Đặt lại"}
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

          {/* Bảng thống kê theo người bán */}
          <OrderStatsTable
              dataList={accountStatisticsByUserList}
              totalPages={totalPages}
              searchObject={searchObject}
              totalElements={totalElements}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
          />

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

export default memo (observer (AdminStatisticsDashboard));