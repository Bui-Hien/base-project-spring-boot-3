import React, { memo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import UserForm from "./UserForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import UserToolbar from "./UserToolbar";
import { ListUserTab } from "../../LocalConstants";
import { Tab, Tabs } from "@mui/material";
import VideoPlayer from "../../common/VideoPlayer";

function UserIndex () {
  const {userStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openConfirmDeleteListPopup,
    openConfirmDeletePopup,
    openCreateEditPopup,
    handleClose,
    handleConfirmDelete,
    handleConfirmDeleteMultiple,
    pagingUser,
    resetStore,
    currentTab,
    setCurrentTab,
    openPopupUnEnabledUser,
    handleUnEnabledUser,
    handleEnabledUser,
    openPopupEnabledUser,
  } = userStore;

  useEffect (() => {
    pagingUser ()
    return resetStore;
  }, []);

  const handleChange = useCallback ((_, newValue) => {
    setCurrentTab (newValue);
  }, [setCurrentTab]);

  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.admin.title")},
            {name:t ("navigation.admin.systemUser")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <UserToolbar/>
          </div>
          {/*  <div className={"col-span-12"}>*/}
          {/*    <UserTabComponent*/}
          {/*        currentTab={currentTab}*/}
          {/*        handleChange={handleChange}*/}
          {/*    />*/}
          {/*    <UserList/>*/}
          {/*  </div>*/}
        </div>

        {openCreateEditPopup && (
            <UserForm/>
        )}

        {/*{openConfirmDeletePopup && (*/}
        {/*    <AlertDialog*/}
        {/*        open={openConfirmDeletePopup}*/}
        {/*        onConfirmDialogClose={handleClose}*/}
        {/*        onYesClick={handleConfirmDelete}*/}
        {/*        title={t ("confirm_dialog.delete.title")}*/}
        {/*        text={t ("confirm_dialog.delete.text")}*/}
        {/*        agree={t ("confirm_dialog.delete.agree")}*/}
        {/*        cancel={t ("confirm_dialog.delete.cancel")}*/}
        {/*    />*/}
        {/*)}*/}

        {/*{openConfirmDeleteListPopup && (*/}
        {/*    <AlertDialog*/}
        {/*        open={openConfirmDeleteListPopup}*/}
        {/*        onConfirmDialogClose={handleClose}*/}
        {/*        onYesClick={handleConfirmDeleteMultiple}*/}
        {/*        title={t ("confirm_dialog.delete_list.title")}*/}
        {/*        text={t ("confirm_dialog.delete_list.text")}*/}
        {/*        agree={t ("confirm_dialog.delete_list.agree")}*/}
        {/*        cancel={t ("confirm_dialog.delete_list.cancel")}*/}
        {/*    />*/}
        {/*)}*/}
        {/*{openPopupUnEnabledUser && (*/}
        {/*    <AlertDialog*/}
        {/*        open={openPopupUnEnabledUser}*/}
        {/*        onConfirmDialogClose={handleClose}*/}
        {/*        onYesClick={handleUnEnabledUser}*/}
        {/*        title={t("Xác nhận khóa tài khoản người dùng")}*/}
        {/*        text={t("Bạn có chắc chắn muốn khóa tài khoản này không?")}*/}
        {/*    />*/}
        {/*)}*/}
        {/*{openPopupEnabledUser && (*/}
        {/*    <AlertDialog*/}
        {/*        open={openPopupEnabledUser}*/}
        {/*        onConfirmDialogClose={handleClose}*/}
        {/*        onYesClick={handleEnabledUser}*/}
        {/*        title={t("Xác nhận mở khóa tài khoản người dùng")}*/}
        {/*        text={t("Bạn có chắc chắn muốn mở khóa tài khoản này không?")}*/}
        {/*    />*/}
        {/*)}*/}
        <VideoPlayer height={"200"} videoId={"ff9ce96d-29eb-41df-823b-49191c0f55d4"}/>
      </div>
  );
}

const UserTabComponent = memo (({currentTab, handleChange}) => (
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
      {ListUserTab.getListData ().map ((tab, index) => (
          <Tab
              key={tab.value ?? index}
              label={tab.name}
              className="!p-3 !min-w-0"
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
          />
      ))}
    </Tabs>
));

export default memo (observer (UserIndex));
