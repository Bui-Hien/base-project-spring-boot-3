import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonTable from "../../common/CommonTable";
import { Checkbox } from "@mui/material";
import { formatVNDMoney } from "../../LocalFunction";
import { AccountCategoryType } from "../../LocalConstants";

function AccountShopList () {
  const {t} = useTranslation ();
  const {accountStore} = useStore ();

  const {
    totalPages,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleSelectListDelete,
    handleOpenOrder
  } = accountStore;

  const columns = [
    {
      accessorKey:"action",
      header:t ("Hành động"),
      enableSorting:false,
      enableColumnFilter:false,
      Cell:({row}) => (
          <div className="flex justify-center items-center">
            <button
                onClick={() => handleOpenOrder (row.original)}
                className="
                          flex items-center gap-2
                          bg-blue-50 hover:bg-blue-100
                          text-blue-600 hover:text-blue-700
                          px-3 py-1.5 rounded-lg
                          border border-blue-200
                          transition-all duration-200 ease-in-out
                          shadow-sm hover:shadow-md
                        "
                title="Mua tài khoản"
            >
              <span className="font-medium text-sm">Mua</span>
            </button>
          </div>
      ),
    },
    {
      accessorKey:"accountCategory.code",
      header:t ("Loại tài khoản"),
    },
    ... (searchObject?.accountCategory?.type === AccountCategoryType.UNIT_PRICE_AND_QUANTITY.value)? [
      {
        accessorKey:"unitPrice",
        header:t ("Xu roblox"),
        Cell:({row}) => {
          return (
              <span
                  className={"flex justify-end"}
              >
              {row.original?.unitPrice}
            </span>
          )
        },
      },

      {
        accessorKey:"price",
        header:t ("Giá"),
        Cell:({row}) => {
          return (
              <span
                  className={"flex justify-end"}
              >
              {formatVNDMoney (row.original?.price)}
            </span>
          )
        },
      },
    ] : [
      {
        accessorKey:"unitPrice",
        header:t ("Số lượng"),
        Cell:({row}) => {
          return (
              <span
                  className={"flex justify-end"}
              >
              {row.original?.unitPrice}
            </span>
          )
        },
      },

      {
        accessorKey:"price",
        header:t ("Giá"),
        Cell:({row}) => {
          return (
              <span
                  className={"flex justify-end"}
              >
              {formatVNDMoney (row.original?.price)}
            </span>
          )
        },
      },
      {
        accessorKey:"description",
        header:t ("Mô tả"),
      },
    ],
    {
      accessorKey:"totalAmount",
      header:t ("Tổng tiền"),
      Cell:({row}) => {
        return (
            <span
                className={"flex justify-end"}
            >
              {formatVNDMoney (row.original?.totalAmount)}
            </span>
        )
      },
    },
    {
      accessorKey: "warrantyPeriod",
      header: t("Thời gian bảo hành"),
      Cell: ({ row }) => {
        const totalMinutes = row.original?.warrantyPeriod;

        if (!totalMinutes && totalMinutes !== 0)
          return <span className="flex justify-end"></span>;

        // Convert
        const days = Math.floor(totalMinutes / 1440); // 1 day = 1440 mins
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        let display = "";

        if (days > 0) {
          display += `${days} ngày `;
        }

        // Only show hours if > 0 OR days > 0
        if (hours > 0 || days > 0) {
          display += `${hours} giờ `;
        }

        // Only show minutes if > 0 OR (no days & no hours)
        if (minutes > 0 || (days === 0 && hours === 0)) {
          display += `${minutes} phút`;
        }

        return <span className="flex justify-end">{display.trim()}</span>;
      },
    },
    ... (searchObject?.accountCategory?.type === AccountCategoryType.UNIT_PRICE_AND_QUANTITY.value)? [
      {
        accessorKey:"premium",
        header:t ("Premium"),
        Cell:({row}) => (
            <Checkbox
                checked={row.original?.premium === true}
                disabled
                size="small"
                style={{opacity:0.5}}
            />
        ),
      },
    ] : [],
  ];

  return (
      <CommonTable
          data={dataList}
          columns={columns}
          totalPages={totalPages}
          pageSize={searchObject.pageSize}
          page={searchObject.pageIndex}
          totalElements={totalElements}
          handleChangePage={(page) => setPageIndex (page, true)}
          setRowsPerPage={(size) => setPageSize (size, true)}
          handleSelectList={handleSelectListDelete}
      />
  );
}

export default observer (AccountShopList);
