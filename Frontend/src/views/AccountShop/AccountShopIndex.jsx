import React, { memo, useEffect } from 'react';
import CategorySidebar from "./Component/CategorySidebar";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import AccountShopList from "./AccountShopList";
import PriceList from "./Component/PriceList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import { useTranslation } from "react-i18next";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import { DEFAULT_SELECTED_CATEGORY } from "../../appConfig";
import { AccountCategoryType } from "../../LocalConstants";

const AccountShopIndex = () => {
  const {t} = useTranslation ();
  const {accountStore, authStore} = useStore ();

  const {
    publicPagingSearchAccount,
    accountCategoryStore,
    publicPrice,
    orderStore,
    handleConfirmFormOrder,
    handleSetSearchObject,
    resetStore
  } = accountStore;

  const {getCurrentUser} = authStore;

  const handleGetInit = async () => {
    handleSetSearchObject (
        {
          accountCategory:{
            code:DEFAULT_SELECTED_CATEGORY
          }
        }
    )
    await accountCategoryStore.handleGetPublicByCode (DEFAULT_SELECTED_CATEGORY);
    publicPrice ();
    publicPagingSearchAccount ();
    accountCategoryStore.publicPagingAccountCategory ();
  }

  useEffect (() => {
    handleGetInit ();

    return () => {
      resetStore ();
    }
  }, [])

  return (
      <div className="content-index bg-slate-50 min-h-screen">
        <CommonBreadcrumb routeSegments={[{name:t ("Danh sách tài khoản")}]}/>
        {/*<AccountShopHeader/>*/}
        <div className="mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Sidebar */}
            <CategorySidebar/>
            <div className="lg:col-span-3 gap-2">
              {accountCategoryStore.selectedRow.type === AccountCategoryType.UNIT_PRICE_AND_QUANTITY.value && (
                  <PriceList/>
              )}
              <AccountShopList/>
            </div>
          </div>
        </div>
        {orderStore.openCreateEditPopup && (
            <AlertDialog
                open={orderStore.openCreateEditPopup}
                onConfirmDialogClose={orderStore.handleClose}
                onYesClick={async () => {
                  await handleConfirmFormOrder ();
                  await getCurrentUser ();
                }}
                title={t ("Xác nhận mua tài khoản")}
                text={t ("Bạn muốn mua tài khoản này")}
                agree={t ("Đồng ý")}
                cancel={t ("Cancel")}
            />
        )}
      </div>
  );
};

export default memo (observer (AccountShopIndex));