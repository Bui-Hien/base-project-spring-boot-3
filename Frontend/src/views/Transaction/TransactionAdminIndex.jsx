import React, { memo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import TransactionList from "./TransactionList";
import TransactionToolbar from "./TransactionToolbar";
import { Tab, Tabs } from "@mui/material";
import { TransactionType } from "../../LocalConstants";
import AlertDialog from "../../common/CommonConfirmationDialog";
import TransactionRejectForm from "./TransactionRejectForm";
import ReportPopup from "./ReportPopup/ReportPopup";

function TransactionAdminIndex () {
  const {transactionStore, reportStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openPopupReport,
  } = reportStore;

  const {
    pagingTransaction,
    currentTab,
    setCurrentTab,
    resetStore,
    openWithdraw,
    handleConfirmWithdrawTransaction,
    handleOpenWithdraw,
    openRejectWithdraw,
    openConfirmDepositTransaction,
    handleConfirmDepositTransaction,
    handleOpenConfirmDepositTransaction,
    handleConfirmDelete,
    handleOpenDelete,
    openDelete
  } = transactionStore;

  useEffect (() => {
    pagingTransaction ()
    return resetStore
  }, []);

  const handleChange = useCallback ((_, newValue) => {
    setCurrentTab (newValue);
  }, [setCurrentTab]);

  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.admin.title")},
            {name:t ("navigation.transaction")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <TransactionToolbar isAdmin={true}/>
          </div>

          <div className={"col-span-12"}>
            <TransactionTabComponent
                currentTab={currentTab}
                handleChange={handleChange}
            />
            <TransactionList isAdmin={true}/>
          </div>
        </div>

        {openRejectWithdraw && (
            <TransactionRejectForm/>
        )}
        {openWithdraw && (
            <AlertDialog
                open={openWithdraw}
                onConfirmDialogClose={() => handleOpenWithdraw (false, null)}
                onYesClick={handleConfirmWithdrawTransaction}
                title={t ("confirm_dialog.delete_list.title")}
                text={t ("confirm_dialog.delete_list.text")}
                agree={t ("confirm_dialog.delete_list.agree")}
                cancel={t ("confirm_dialog.delete_list.cancel")}
            />
        )}
        {openConfirmDepositTransaction && (
            <AlertDialog
                open={openConfirmDepositTransaction}
                onConfirmDialogClose={() => handleOpenConfirmDepositTransaction (false, null)}
                onYesClick={handleConfirmDepositTransaction}
                title={t ("Xác nhận người dùng nạp tiền")}
                text={t ("Bạn có chắc chắn người dùng này nạp tiền không")}
                agree={t ("confirm_dialog.delete_list.agree")}
                cancel={t ("confirm_dialog.delete_list.cancel")}
            />
        )}
        {openDelete && (
            <AlertDialog
                open={openDelete}
                onConfirmDialogClose={() => handleOpenDelete (false)}
                onYesClick={handleConfirmDelete}
                title={t ("Xác nhận xóa lịch sử giao dịch")}
                text={t ("Bạn có chắc chắn muốn xóa các giao 7 ngày trước đó?")}
                agree={t ("Đồng ý")}
                cancel={t ("Hủy")}
            />
        )}
        {openPopupReport && (
            <ReportPopup/>
        )}
      </div>
  );
}

const TransactionTabComponent = memo (({currentTab, handleChange}) => (
    <Tabs
        value={currentTab}
        onChange={handleChange}
        aria-label="user tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          borderBottom:1,
          borderColor:"divider",
          mb:2,
          ".MuiTab-root":{
            minWidth:"unset",
            textTransform:"none",
            padding:"8px 16px",
            fontWeight:500,
            color:"text.secondary",
          },
          ".Mui-selected":{
            color:"primary.main",
            fontWeight:600,
            borderBottom:"2px solid",
            borderColor:"primary.main",
          },
        }}
    >
      {[{value:null, name:"Tất cả"}, ... TransactionType.getListData ()].map ((tab, index) => (
          <Tab
              key={tab.value ?? index}
              value={tab.value}
              label={tab.name}
              className="!p-3 !min-w-0"
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
          />
      ))}
    </Tabs>
));
export default memo (observer (TransactionAdminIndex));
