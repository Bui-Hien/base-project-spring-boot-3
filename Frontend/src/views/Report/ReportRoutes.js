import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./ReportSellerIndex"));
const ViewComponentAdmin = lazy (() => import("./ReportAdminIndex"));

export const ReportAdminRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/report",
    exact:true,
    component:ViewComponentAdmin,
    auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export const ReportSellerRoutes = [
  {
    path:ConstantList.ROOT_PATH + "seller/report",
    exact:true,
    component:ViewComponent,
    auth:[SystemRole.ROLE_SELLER, SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];
