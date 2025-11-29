import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./OrderIndex"));
const ViewComponentSeller = lazy (() => import("./OrderSellerIndex"));
const ViewComponentAdmin = lazy (() => import("./OrderAdminIndex"));

export const OrderRoutes = [
  {
    path:ConstantList.ROOT_PATH + "order",
    exact:true,
    component:ViewComponent,
    auth:[SystemRole.ROLE_USER, SystemRole.ROLE_SELLER, SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export const OrderAdminRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/order",
    exact:true,
    component:ViewComponentAdmin,
    auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export const OrderSellerRoutes = [
  {
    path:ConstantList.ROOT_PATH + "seller/order",
    exact:true,
    component:ViewComponentSeller,
    auth:[SystemRole.ROLE_SELLER, SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

