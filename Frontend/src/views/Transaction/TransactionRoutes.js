import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./TransactionIndex"));
const ViewComponentAdmin = lazy (() => import("./TransactionAdminIndex"));

export const TransactionRoutes = [
  {
    path:ConstantList.ROOT_PATH + "transaction",
    exact:true,
    component:ViewComponent,
    auth:[
      SystemRole.ROLE_USER,
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
];

export const TransactionAdminRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/transaction",
    exact:true,
    component:ViewComponentAdmin,
    auth:[
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
];
