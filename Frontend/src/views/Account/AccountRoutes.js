import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./AccountSellerIndex"));
const ViewComponentAdmin = lazy (() => import("./AccountAdminIndex"));

export const AccountSellerRoutes = [
  {
    path:ConstantList.ROOT_PATH + "/seller/account",
    exact:true,
    component:ViewComponent,
    auth:[
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
];

export const AccountAdminRoutes = [
  {
    path:ConstantList.ROOT_PATH + "/admin/account",
    exact:true,
    component:ViewComponentAdmin,
    auth:[
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
];

