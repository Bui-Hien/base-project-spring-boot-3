import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Checkbox, Tooltip } from "@mui/material";
import CommonTable from "../../common/CommonTable";
import { formatDateTime, formatVNDMoney } from "../../LocalFunction";
import { ReportStatus } from "../../LocalConstants";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function OrderList ({isBuyer, isAdmin}) {
  const {t} = useTranslation ();
  const {orderStore, reportStore} = useStore ();

  const {
    totalPages,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleSelectListDelete,
    handleOpenCreateEdit,
  } = orderStore;

  const {
    handleOpenCreate:handleOpenCreateReportStore,
    handleOpenUpdateStatus,
    handleOpenEdit:handleOpenEditReportStore,
  } = reportStore;
  const columns = [
    ... (isBuyer || isAdmin)? [
      {
        accessorKey:"action",
        header:t ("Hành động"),
        Cell:({row}) => {
          const createdAtUTC = dayjs.utc(row.original.createdAt);
          const expiryDateUTC = createdAtUTC.add(row.original.account.warrantyPeriod ?? 0, 'minute');
          const isUnderWarranty = expiryDateUTC.isAfter(dayjs.utc());

          return (
              <div className="flex flex-middle justify-center">
                {isBuyer && (
                    <>
                      {(isUnderWarranty && !row.original?.report?.id) && (
                          <Tooltip title={t ("Báo cáo")} placement="top">
                            <ReportProblemOutlinedIcon
                                className="cursor-pointer ml-4 text-yellow-600 hover:text-yellow-800 transition-all duration-200"
                                onClick={() => {
                                  handleOpenCreateEdit (row.original?.id);
                                  handleOpenCreateReportStore ();
                                }}
                            />
                          </Tooltip>
                      )}

                      {row.original?.report?.id && row.original?.report?.status === ReportStatus.PENDING.value && (
                          <Tooltip title={t ("Hủy report")} placement="top">
                            <CancelOutlinedIcon
                                className="cursor-pointer ml-4 text-red-500 hover:text-red-700 transition-all duration-200"
                                onClick={() =>
                                    handleOpenUpdateStatus (row.original?.report?.id)
                                }
                            />
                          </Tooltip>
                      )}
                    </>
                )}
                {isAdmin && row.original?.report?.id && row.original?.report?.status === ReportStatus.PENDING.value && (
                    <Tooltip title={t ("Hủy report")} placement="top">
                      <CancelOutlinedIcon
                          className="cursor-pointer ml-4 text-red-500 hover:text-red-700 transition-all duration-200"
                          onClick={() =>
                              handleOpenUpdateStatus (row.original?.report?.id)
                          }
                      />
                    </Tooltip>
                )}
              </div>
          );
        },
      },
    ] : [],
    {
      accessorKey:"Nội dung",
      header:
          t ("Thông tin report"),
      minWidth:250,
      Cell:({row}) => {
        if (!row.original?.report?.id) {
          return <span></span>
        }
        const reason = row.original?.report?.reason?.name || null;
        const content = row.original?.report?.content || null;
        const response = row.original?.report?.response || null;
        const status = ReportStatus.getListData ().find (i => i.value === row.original?.report?.status)?.name || null;
        return (
            <div className="flex flex-col">
              {reason && <div><strong>{t ("Lý do")}:</strong> {reason}</div>}
              {content && <div><strong>{t ("Nội dung")}:</strong> {content}</div>}
              {response && <div><strong>{t ("Phản hồi")}:</strong> {response}</div>}
              {status && <div><strong>{t ("Trạng thái")}:</strong> {status}</div>}
            </div>
        );
      }
    },
    {
      accessorKey:"account.accountName",
      header:
          t ("Tài khoản"),
    },
    {
      accessorKey:"account.password",
      header:
          t ("Mật khẩu"),
    },
    {
      accessorKey:"account.twoFactor",
      header:
          t ("2FA"),
    },
    {
      accessorKey:"account.premium",
      header:t ("Premium"),
      Cell:({row}) => (
          <Checkbox
              checked={row.original?.account?.premium === true}
              disabled
              size="small"
              style={{opacity:0.5}}
          />
      ),
    },
    {
      accessorKey:"account.warrantyIssued",
      header:t ("Bảo hành band"),
      Cell:({row}) => (
          <Checkbox
              checked={row.original?.account?.warrantyIssued === true}
              disabled
              size="small"
              style={{opacity:0.5}}
          />
      ),
    },
    {
      accessorKey:"account.unitPrice",
      header:
          t ("Rate"),
    },
    {
      accessorKey:"account.price",
      header:
          t ("Robux"),
    },
    {
      accessorKey:"account.warrantyPeriod",
      header:
          t ("Bảo hành"),
    },
    {
      accessorKey:"account.totalAmount",
      header:t ("Số tiền giao dịch"),
      Cell:({row}) => (
          <div className={"text-right"}>
            <span>{formatVNDMoney (row.original?.account?.totalAmount)}</span>
          </div>
      ),
    },
    {
      accessorKey:"account.createdAt",
      header:t ("Ngày đăng"),
      Cell:({row}) => (
          <div className="text-center">
            <span>{formatDateTime ('DD/MM/YYYY HH:mm', row.original?.account?.createdAt)}</span>
          </div>
      ),
    },
    {
      accessorKey:"createdAt",
      header:
          t ("Giờ bán"),
      Cell:({row}) => (
          <div className="text-center">
            <span>{formatDateTime ('DD/MM/YYYY HH:mm', row.original?.createdAt)}</span>
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
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
          handleSelectList={handleSelectListDelete}
      />
  );
}

export default observer (OrderList);
