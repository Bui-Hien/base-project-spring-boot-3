import React, { memo } from "react";
import CommonTable from "../../../common/CommonTable";
import { useTranslation } from "react-i18next";
import { formatVNDMoney } from "../../../LocalFunction";
import SearchObject from "../../../common/dto/search/SearchObject";

const OrderStatsTableComponent = ({
                                    dataList = [],
                                    totalPages = 0,
                                    searchObject = JSON.parse (JSON.stringify (new SearchObject ())),
                                    totalElements = 0,
                                    setPageIndex,
                                    setPageSize,
                                  }) => {
  const {t} = useTranslation ();

  const columns = [
    {
      accessorKey:"seller.displayName",
      header:t ("dashboard.seller-user"),
      Cell:({row}) => (
          <div className="flex items-center">
            <div
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {row.original?.seller?.displayName?.charAt (0)?.toUpperCase () || ""}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {row.original?.seller?.displayName}
              </div>
            </div>
          </div>
      ),
    },
    {
      accessorKey:"totalRevenue",
      header:t ("dashboard.total-revenue"),
      Cell:({row}) => (
          <div className="text-sm font-semibold text-gray-900">
            {formatVNDMoney (row.original?.totalRevenue)}
          </div>
      ),
    },
    {
      accessorKey:"totalOrders",
      header:t ("dashboard.total-order"),
      Cell:({row}) => (
          <div className="text-sm text-gray-900">{row.original?.totalOrders}</div>
      ),
    },
    {
      accessorKey:"successfulOrders",
      header:t ("dashboard.order-success"),
      Cell:({row}) => (
          <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {row.original?.successfulOrders}
          </div>
      ),
    },
    {
      accessorKey:"errorOrders",
      header:t ("dashboard.order-error"),
      Cell:({row}) => (
          <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            {row.original?.errorOrders}
          </div>
      ),
    },
    {
      accessorKey:"refundedOrders",
      header:t ("dashboard.order-refund"),
      Cell:({row}) => (
          <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {row.original?.refundedOrders}
          </div>
      ),
    },
    {
      accessorKey:"processingOrders",
      header:t ("dashboard.order-processing"),
      Cell:({row}) => (
          <div className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {row.original?.processingOrders}
          </div>
      ),
    },
    {
      accessorKey:"successRate",
      header:t ("dashboard.percentage-success"),
      Cell:({row}) => (
          <div className="flex items-center w-full max-w-[180px]">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 overflow-hidden">
              <div
                  className="bg-green-500 h-2"
                  style={{width:`${row.original?.successRate}%`}}
              ></div>
            </div>
            <span className="text-sm text-gray-900 font-medium">
            {row.original?.successRate.toFixed (0)}%
          </span>
          </div>
      ),
    },
  ];

  return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t ("dashboard.statistics-seller")}
        </h3>
        <div className="overflow-x-auto">
          <CommonTable
              data={dataList}
              columns={columns}
              selection={false}
              nonePagination={false}
              totalPages={totalPages}
              pageSize={searchObject.pageSize}
              page={searchObject.pageIndex}
              totalElements={totalElements}
              handleChangePage={setPageIndex}
              setRowsPerPage={setPageSize}
          />
        </div>
      </div>
  );
};

export const OrderStatsTable = memo (OrderStatsTableComponent);
