import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonTable from "../../common/CommonTable";
import { Checkbox, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AccountStatus } from "../../LocalConstants";
import { formatMoney, getDateTime } from "../../LocalFunction";

function AccountList () {
  const {t} = useTranslation ();
  const {accountStore} = useStore ();

  const {
    handleOpenCreateEdit,
    totalPages,
    handleDelete,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleSelectListDelete
  } = accountStore;

  const columns = [
    {
      accessorKey:"action",
      header:t ("Thao tác"),
      Cell:({row}) => (
          <div className="flex items-center justify-center space-x-3">
            {row.original?.status !== AccountStatus.SOLD.value && (
                <>
                  <Tooltip title={t ("Cập nhật thông tin")} placement="top">
                    <button
                        onClick={() => handleOpenCreateEdit (row.original?.id)}
                        className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <EditIcon fontSize="small"/>
                    </button>
                  </Tooltip>
                  {(row.original?.status === AccountStatus.ERROR.value) && (
                      <Tooltip title={t ("Xóa")} placement="top">
                        <button
                            onClick={() => handleDelete (row.original)}
                            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <DeleteIcon fontSize="small"/>
                        </button>
                      </Tooltip>
                  )}
                </>
            )}
          </div>
      ),
    },
    {
      accessorKey:"accountCategory.code",
      header:t ("Loại tài khoản"),
    },
    {
      accessorKey:"accountName",
      header:t ("Tài khoản"),
    },
    {
      accessorKey:"password",
      header:t ("Mật khẩu"),
    },
    {
      accessorKey:"unitPrice",
      header:t ("Số lượng(Xu roblox)"),
      Cell:({row}) => {
        return <span className={"flex justify-end"}>{row.original?.unitPrice || ""}</span>
      },
    },
    {
      accessorKey:"price",
      header:t ("Đơn giá"),
      Cell:({row}) => {
        return <span className={"flex justify-end"}>{formatMoney (row.original?.price)}</span>
      },
    },
    {
      accessorKey:"warrantyPeriod",
      header:t ("Bảo hành"),
    },
    {
      accessorKey:"totalAmount",
      header:t ("Tổng tiền"),
      Cell:({row}) => {
        return <span className={"flex justify-end"}>{formatMoney (row.original?.totalAmount)}</span>
      },
    },
    {
      accessorKey:"description",
      header:t ("Mô tả"),
    },
    {
      accessorKey:"createdAt",
      header:t ("Ngày đăng"),
      Cell:({row}) => {
        return <span>{getDateTime (row.original?.createdAt)}</span>
      },
    },
    {
      accessorKey:"status",
      header:t ("Trạng thái"),
      Cell:({row}) => {
        let value = row.original?.status;
        const status = AccountStatus.getListData ().find (i => i.value === value);

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${status?.className || ''}`}>
                {status?.name || "-"}
            </span>
        );
      },
    },
    {
      accessorKey:"twoFactor",
      header:t ("2FA"),
    },
    {
      accessorKey:"warrantyPeriod",
      header:t ("Thời gian bảo hành"),
      Cell:({row}) => {
        const totalMinutes = row.original?.warrantyPeriod;

        if (!totalMinutes && totalMinutes !== 0)
          return <span className="flex justify-end"></span>;

        // Convert
        const days = Math.floor (totalMinutes / 1440); // 1 day = 1440 mins
        const hours = Math.floor ((totalMinutes % 1440) / 60);
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

        return <span className="flex justify-end">{display.trim ()}</span>;
      },
    },
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

  ];

  return (
      <CommonTable
          data={dataList}
          columns={columns}
          selection={true}
          totalPages={totalPages}
          pageSize={searchObject?.pageSize}
          page={searchObject?.pageIndex}
          totalElements={totalElements}
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
          handleSelectList={(listData = []) => {
            const listSelected = listData.filter (
                (item) => {
                  return item?.status !== AccountStatus.SOLD.value;
                }
            );
            handleSelectListDelete (listSelected);
          }}
          rowSelectable={(row) => (row?.status !== AccountStatus.SOLD.value)}
      />
  );
}

export default observer (AccountList);
