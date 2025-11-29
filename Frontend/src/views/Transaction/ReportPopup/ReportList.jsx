import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { observer } from "mobx-react-lite";
import { ReplyAllIcon, UndoIcon } from "lucide-react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useStore } from "../../../stores";
import CommonTable from "../../../common/CommonTable";
import { formatDateTime, formatVNDMoney } from "../../../LocalFunction";
import { OrderStatus, ReportStatus } from "../../../LocalConstants";

function ReportList () {
  const {t} = useTranslation ();
  const {reportStore} = useStore ();

  const {
    totalPages,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleSelectListDelete,
    handleOpenUpdateStatus,
    handleOpenRefundBuyer,
    handleOpenRefundSeller
  } = reportStore;


  const columns = [
    {
      accessorKey:"action",
      header:t ("Hành động"),
      Cell:({row}) => (
          <div className="flex items-center justify-center">
            <Tooltip title={t ("Hoàn tiền cho người mua")} placement="top">
              <IconButton
                  disabled={row.original?.order?.status === OrderStatus.REFUNDED.value || row.original?.order?.refundBuyer}
                  onClick={() => handleOpenRefundBuyer (row.original)}
              >
                <ReplyAllIcon fontSize="small"/>
              </IconButton>
            </Tooltip>

            <Tooltip title={t ("Hoàn tiền cho người bán")} placement="top">
              <IconButton
                  disabled={row.original?.order?.status === OrderStatus.REFUNDED_BUYER.value || row.original?.order?.refundSeller}
                  onClick={() => handleOpenRefundSeller (row.original)}
              >
                <UndoIcon fontSize="small" className="text-green-600 hover:text-green-800"/>
              </IconButton>
            </Tooltip>

            <Tooltip title={t ("Hủy báo cáo")} placement="top">
              <IconButton
                  disabled={row.original?.status === ReportStatus.COMPLETED.value}
                  onClick={() =>
                      handleOpenUpdateStatus (row.original?.id)
                  }
              >
                <CancelOutlinedIcon
                    className={`cursor-pointer ml-4 ${row.original?.status === ReportStatus.COMPLETED.value? "" : " text-red-500 hover:text-red-700 "}  transition-all duration-200`}/>
              </IconButton>
            </Tooltip>
          </div>
      ),
    },
    {
      accessorKey:"Nội dung",
      header:
          t ("Nội dung"),
      Cell:({row}) => {
        const reason = row.original?.reason?.name || null;
        const content = row.original?.content || null;
        const response = row.original?.response || null;

        return (
            <div className="flex flex-col">
              {reason && <div><strong>{t ("Lý do")}:</strong> {reason}</div>}
              {content && <div><strong>{t ("Nội dung")}:</strong> {content}</div>}
              {response && <div><strong>{t ("Phản hồi")}:</strong> {response}</div>}
            </div>
        );
      }
    },
    {
      accessorKey:"status",
      header:
          t ("Trạng thái báo cáo"),
      Cell:({row}) => {
        let value = row.original?.status;
        const status = ReportStatus.getListData ().find (i => i.value === value);

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${status?.className || ''}`}>
                {status?.name || "-"}
            </span>
        );
      },
    },
    {
      accessorKey:"order.orderCode",
      header:
          t ("ORDER ID"), // hoặc "Name"
    },
    {
      accessorKey:"order.account.accountCategory.name",
      header:
          t ("Loại nick"), // hoặc "Description"
    },
    {
      accessorKey:"order.account.accountName",
      header:
          t ("Tài khoản"), // hoặc "Description"
    },
    {
      accessorKey:"order.account.password",
      header:
          t ("Mật khẩu"), // hoặc "Description"
    },
    {
      accessorKey:"order.account.totalAmount",
      header:
          t ("Giá"), // hoặc "Description"
      Cell:({row}) => (
          <div className={"text-right"}>
            <span>{formatVNDMoney (row.original?.order?.account?.totalAmount)}</span>
          </div>
      ),
    },
    {
      accessorKey:"order.createdAt",
      header:
          t ("Giờ mua"), // hoặc "Description"
      Cell:({row}) => (
          <div className="text-center">
            <span>{formatDateTime ('DD/MM/YYYY HH:mm', row.original?.createdAt)}</span>
          </div>
      ),
    },
    {
      accessorKey:"createdAt",
      header:
          t ("Thời gian khiếu nại"), // hoặc "Description"
      Cell:({row}) => (
          <div className="text-center">
            <span>{formatDateTime ('DD/MM/YYYY HH:mm', row.original?.order?.createdAt)}</span>
          </div>
      ),
    },
  ];

  return (
      <CommonTable
          data={dataList}
          columns={columns}
          nonePagination={false}
          totalPages={totalPages}
          pageSize={searchObject.pageSize}
          page={searchObject.pageIndex}
          totalElements={totalElements}
          pageSizeOption={[5, 10, 15]}
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
          handleSelectList={handleSelectListDelete}
      />
  );
}

export default memo (observer (ReportList));
