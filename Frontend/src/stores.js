import { createContext, useContext } from "react";
import AuthStore from "./auth/AuthStore";
import BankStore from "./views/Bank/BankStore";
import ReasonStore from "./views/Reason/ReasonStore";
import UserStore from "./views/User/UserStore";
import SystemConfigStore from "./views/SystemConfig/SystemConfigStore";
import VipLevelStore from "./views/VipLevel/VipLevelStore";
import TransactionStore from "./views/Transaction/TransactionStore";
import AccountStore from "./views/Account/AccountStore";
import ReportStore from "./views/Report/ReportStore";
import PostStore from "./views/Post/PostStore";
import AccountCategoryStore from "./views/AccountCategory/AccountCategoryStore";
import SystemStatisticStore from "./views/SystemStatistic/SystemStatisticStore";
import OrderStore from "./views/Order/OrderStore";
import DepositStore from "./views/Deposit/DepositStore";
import WalletStore from "./views/Wallet/WalletStore";
import AccountStatisticsStore from "./views/AccountStatistics/AccountStatisticsStore";
import CallApiLoadingStore from "./common/Layout/CallApiLoadingStore";
import NotificationStore from "./views/Notification/NotificationStore";

export const store = {
  callApiLoadingStore:new CallApiLoadingStore (),
  authStore:new AuthStore (),
  bankStore:new BankStore (),
  reasonStore:new ReasonStore (),
  vipLevelStore:new VipLevelStore (),
  accountStore:new AccountStore (),
  reportStore:new ReportStore (),
  postStore:new PostStore (),
  accountCategoryStore:new AccountCategoryStore (),
  orderStore:new OrderStore (),

  //Quản lý danh mục chung
  systemConfigStore:new SystemConfigStore (),
  userStore:new UserStore (),
  transactionStore:new TransactionStore (),
  systemStatisticStore:new SystemStatisticStore (),
  paymentStore:new DepositStore (),
  walletStore:new WalletStore (),
  accountStatisticsStore:new AccountStatisticsStore (),
  notificationStore:new NotificationStore (),
};

export const StoreContext = createContext (store);

export function useStore () {
  return useContext (StoreContext);
}
