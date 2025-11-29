import BankRoutes from "./views/Bank/BankRoutes";
import ReasonRoutes from "./views/Reason/ReasonRoutes";
import UserRoutes from "./views/User/UserRoutes";
import VipLevelRoutes from "./views/VipLevel/VipLevelRoutes";
import SystemConfigRoutes from "./views/SystemConfig/SystemConfigRoutes";
import PostRoutes from "./views/Post/PostRoutes";
import AccountCategoryRoutes from "./views/AccountCategory/AccountCategoryRoutes";
import InstructRoutes from "./views/Instruct/InstructRoutes";
import SystemStatisticRoutes from "./views/SystemStatistic/SystemStatisticRoutes";
import DepositRoutes from "./views/Deposit/DepositRoutes";
import WalletRoutes from "./views/Wallet/WalletRoutes";
import {
  AccountStatisticsAdminRoutes,
  AccountStatisticsSellerRoutes
} from "./views/AccountStatistics/AccountStatisticsRoutes";
import { AccountAdminRoutes, AccountSellerRoutes } from "./views/Account/AccountRoutes";
import { ReportAdminRoutes, ReportSellerRoutes } from "./views/Report/ReportRoutes";
import { OrderAdminRoutes, OrderRoutes, OrderSellerRoutes } from "./views/Order/OrderRoutes";
import { TransactionAdminRoutes, TransactionRoutes } from "./views/Transaction/TransactionRoutes";

import HomeRoutes from "./views/Home/HomeRoutes";
import AccountShopRoutes from "./views/AccountShop/AccountShopRoutes";
import GuaranteeRoutes from "./views/Guarantee/GuaranteeRoutes";
import NotificationRoutes from "./views/Notification/NotificationRoutes";

const routes = [
  // 👤 User
  ... HomeRoutes,
  ... AccountShopRoutes,
  ... GuaranteeRoutes,
  ... NotificationRoutes,
  ... InstructRoutes,
  ... DepositRoutes,
  ... OrderRoutes,
  ... TransactionRoutes,

  // 💼 Seller
  ... AccountStatisticsSellerRoutes,
  ... AccountSellerRoutes,
  ... OrderSellerRoutes,
  ... ReportSellerRoutes,
  ... WalletRoutes,

  // 🧑‍💼 Admin / Manager
  ... AccountCategoryRoutes,
  ... BankRoutes,
  ... ReasonRoutes,
  ... UserRoutes,
  ... VipLevelRoutes,
  ... SystemConfigRoutes,
  ... TransactionAdminRoutes,
  ... PostRoutes,
  ... SystemStatisticRoutes,
  ... AccountStatisticsAdminRoutes,
  ... AccountAdminRoutes,
  ... OrderAdminRoutes,
  ... ReportAdminRoutes
];

export default routes;
