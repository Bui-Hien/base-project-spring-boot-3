import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const AdminAccountStatistics = lazy (() => import("./AdminAccountStatistics"));
const SellerAccountStatistics = lazy (() => import("./SellerAccountStatistics"));

export const AccountStatisticsAdminRoutes = [
  {
    path:`${ConstantList.ROOT_PATH}admin/account-statistics`,
    exact:true,
    component:AdminAccountStatistics,
    auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export const AccountStatisticsSellerRoutes = [
  {
    path:`${ConstantList.ROOT_PATH}seller/account-statistics`,
    exact:true,
    component:SellerAccountStatistics,
    auth:[
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
];