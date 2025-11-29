import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./DepositIndex"));

const DepositRoutes = [
  {
    path:ConstantList.ROOT_PATH + "deposit",
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

export default DepositRoutes;
