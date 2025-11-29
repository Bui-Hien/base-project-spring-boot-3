import React, { memo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import AccountForm from "./AccountForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import AccountList from "./AccountList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import AccountToolbar from "./AccountToolbar";
import { Tab, Tabs } from "@mui/material";
import { AccountStatus } from "../../LocalConstants";

function AccountAdminIndex () {
  const {accountStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openConfirmDeleteListPopup,
    openConfirmDeletePopup,
    openCreateEditPopup,
    handleClose,
    handleConfirmDelete,
    handleConfirmDeleteMultiple,
    pagingAccount,
    currentTab,
    setCurrentTab,
    openAccountStatusErr,
    openAccountStatusNew,
    handleUpdateAccountStatusErr,
    handleUpdateAccountStatusNew,
    resetStore
  } = accountStore;

  useEffect (() => {
    pagingAccount ()
    return resetStore
  }, []);

  const handleChange = useCallback ((_, newValue) => {
    setCurrentTab (newValue);
  }, [setCurrentTab]);

  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("Quản lý hệ thống")},
            {name:t ("Tài khoản")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <AccountToolbar isAdmin={true}/>
          </div>

          <div className={"col-span-12"}>
            <AccountTabComponent
                currentTab={currentTab}
                handleChange={handleChange}
            />
            <AccountList/>
          </div>
        </div>

        {openCreateEditPopup && (
            <AccountForm/>
        )}

        {openConfirmDeletePopup && (
            <AlertDialog
                open={openConfirmDeletePopup}
                onConfirmDialogClose={handleClose}
                onYesClick={handleConfirmDelete}
                title={t ("confirm_dialog.delete.title")}
                text={t ("confirm_dialog.delete.text")}
                agree={t ("confirm_dialog.delete.agree")}
                cancel={t ("confirm_dialog.delete.cancel")}
            />
        )}
        {openAccountStatusErr && (
            <AlertDialog
                open={openAccountStatusErr}
                onConfirmDialogClose={handleClose}
                onYesClick={handleUpdateAccountStatusErr}
                title={t ("Xác nhận tài khoản lỗi")}
                text={t ("Bạn có muốn xác nhận hành động này?")}
                agree={t ("confirm_dialog.delete.agree")}
                cancel={t ("confirm_dialog.delete.cancel")}
            />
        )}
        {openAccountStatusNew && (
            <AlertDialog
                open={openAccountStatusNew}
                onConfirmDialogClose={handleClose}
                onYesClick={handleUpdateAccountStatusNew}
                title={t ("Xác nhận duyệt tài khoản")}
                text={t ("Bạn có chắc chắn muốn duyệt ghi này?")}
                agree={t ("confirm_dialog.delete.agree")}
                cancel={t ("confirm_dialog.delete.cancel")}
            />
        )}
        {openConfirmDeleteListPopup && (
            <AlertDialog
                open={openConfirmDeleteListPopup}
                onConfirmDialogClose={handleClose}
                onYesClick={handleConfirmDeleteMultiple}
                title={t ("confirm_dialog.delete_list.title")}
                text={t ("confirm_dialog.delete_list.text")}
                agree={t ("confirm_dialog.delete_list.agree")}
                cancel={t ("confirm_dialog.delete_list.cancel")}
            />
        )}
      </div>
  );
}

const AccountTabComponent = memo (({currentTab, handleChange}) => (
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
      {[{value:null, name:"Tất cả"}, ... AccountStatus.getListData ()].map ((tab, index) => (
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

export default memo (observer (AccountAdminIndex));
