import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonTable from "../../common/CommonTable";
import { formatVNDMoney, getDateTime } from "../../LocalFunction";
import { TransactionStatus, TransactionType } from "../../LocalConstants";
import { IconButton, Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import FileUpload from "../../common/UploadFile/FileUpload";
import PreviewFileViewer from "../../common/UploadFile/PreviewFileViewer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaidIcon from "@mui/icons-material/Paid";
import PreviewBankInfo from "./PreviewBankInfo";
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function TransactionList ({isAdmin}) {
  const {t} = useTranslation ();
  const {transactionStore, reportStore} = useStore ();

  const {
    totalPages,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleUpdateAttachment,
    handleOpenWithdraw,
    handleSelectListDelete,
    handleOpenConfirmDepositTransaction,
    handleSetSelectedRow
  } = transactionStore;

  const {handleOpenReportPopup} = reportStore;


  const columns = [
    {
      accessorKey:"action",
      header:t ("Hành động"),
      Cell:({row}) => {
        return (
            <div className="flex flex-middle justify-center gap-2">
              {row.original?.attachment?.id && (
                  <PreviewFileViewer
                      selectedFile={row.original?.attachment}
                      disabled={!row.original?.attachment?.id}
                      title={"Xem hóa đơn"}
                      icon={<ReceiptLongIcon/>}
                  />
              )}
              {isAdmin && row.original?.type === TransactionType.DEPOSIT.value && row.original?.status === TransactionStatus.PENDING.value && (
                  <>
                    <Tooltip title={t ("Xác nhận nạp tiền")}>
                      <IconButton
                          onClick={() => handleOpenConfirmDepositTransaction (true, row.original)}>
                        <PaidIcon/>
                      </IconButton>
                    </Tooltip>
                  </>
              )}
              {isAdmin && row.original?.type === TransactionType.WITHDRAW.value && (
                  <>
                    <Tooltip title={t ("Xem thông tin tài khoản ngân hàng")}>
                      <PreviewBankInfo
                          selectedFile={row.original?.user?.bankQrCode}
                          title={"Xem thông tin tài khoản ngân hàng"}
                          bank={row.original?.user?.bank}
                          accountNumber={row.original?.user?.accountNumber}
                          beneficiaryName={row.original?.user?.beneficiaryName}
                          icon={<AccountBalanceIcon/>}
                      />
                    </Tooltip>
                    <Formik
                        validationSchema={{}}
                        enableReinitialize
                        initialValues={{}}
                        onSubmit={() => {
                        }}
                    >
                      {({isSubmitting, values, setFieldValue, initialValues}) => (
                          <Form autoComplete="off">
                            <FileUpload
                                disabled={(TransactionStatus.PENDING.value !== row.original?.status)}
                                onUploadSuccess={async (file) => {
                                  await handleUpdateAttachment (row.original?.id, file?.id)
                                }}
                                title="Tải hóa đơn"
                                multiple={false}
                            />
                          </Form>
                      )}
                    </Formik>
                    <Tooltip title={"Xác nhận rút tiền"}>
                      <IconButton
                          disabled={!row.original?.attachment?.id || TransactionStatus.APPROVED.value === row.original?.status}
                          onClick={() => handleOpenWithdraw (true, row.original)}>
                        <AttachMoneyIcon/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Xem thông tin báo cáo"}>
                      <IconButton
                          onClick={() => {
                            handleOpenReportPopup ();
                            handleSetSelectedRow (row.original)
                          }}>
                        <AssessmentIcon/>
                      </IconButton>
                    </Tooltip>
                  </>
              )}
            </div>
        );
      }
    },
    {
      accessorKey:"code",
      header:t ("Mã giao dịch"),
    },
    {
      accessorKey:"user.displayName",
      header:t ("Người giao dịch"),
    },
    {
      accessorKey:"amount",
      header:t ("Số tiền"),
      Cell:({row}) => (
          <div className={"text-right"}>
            <span>{formatVNDMoney (row.original?.amount)}</span>
          </div>
      ),
    },
    {
      accessorKey:"type",
      header:t ("Loại giao dịch"),
      Cell:({row}) => (
          <span>
            {TransactionType.getListData ().find (item => item.value === row.original?.type)?.name || ''}
          </span>
      ),
    },
    {
      accessorKey:"status",
      header:t ("Trạng thái"),
      Cell:({row}) => (
          <span>
            {TransactionStatus.getListData ().find (item => item.value === row.original?.status)?.name || ''}
          </span>
      ),
    },
    {
      accessorKey:"note",
      header:t ("Ghi chú"),
      Cell:({row}) => {
        const note = row.original?.note || "";
        return (
            <Tooltip title={note} arrow>
              <span
                  style={{
                    display:"inline-block",
                    maxWidth:"200px",
                    whiteSpace:"nowrap",
                    overflow:"hidden",
                    textOverflow:"ellipsis",
                    verticalAlign:"middle",
                  }}
              >
                {note}
              </span>
            </Tooltip>
        );
      },
    },
    {
      accessorKey:"balanceBefore",
      header:t ("Số dư trước"),
      Cell:({row}) => (
          <div className={"text-right"}>
            <span>{formatVNDMoney (row.original?.balanceBefore)}</span>
          </div>
      ),
    },
    {
      accessorKey:"balanceAfter",
      header:t ("Số dư sau"),
      Cell:({row}) => (
          <div className={"text-right"}>
            <span>{formatVNDMoney (row.original?.balanceAfter)}</span>
          </div>
      ),
    },
    {
      accessorKey:"description",
      header:t ("Nội dung"),
      Cell:({row}) => (
          <Tooltip title={row.original?.description || ""}>
            <span
                style={{
                  display:"inline-block",
                  maxWidth:200,
                  whiteSpace:"nowrap",
                  overflow:"hidden",
                  textOverflow:"ellipsis",
                  verticalAlign:"middle",
                }}
            >
              {row.original?.description || ""
              }
            </span>
          </Tooltip>
      ),
    },
    {
      accessorKey:"order.account.accountName",
      header:t ("Tên tài khoản"),
    },
    {
      accessorKey:"createdTransaction",
      header:t ("Thời gian giao dịch"),
      Cell:({row}) => (
          <span>
              {getDateTime (row.original?.createdTransaction)}
            </span>
      ),
    },
  ];

  return (
      <CommonTable
          data={dataList}
          columns={columns}
          selection={isAdmin}
          nonePagination={false}
          totalPages={totalPages}
          pageSize={searchObject.pageSize}
          page={searchObject.pageIndex}
          totalElements={totalElements}
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
          handleSelectList={(listData = []) => {
            const listSelected = listData.filter (
                (item) => {
                  return item?.status === TransactionStatus.PENDING.value;
                }
            );
            handleSelectListDelete (listSelected);
          }}
          rowSelectable={(row) => (row.status === TransactionStatus.PENDING.value)}
      />
  );
}

export default observer (TransactionList);
