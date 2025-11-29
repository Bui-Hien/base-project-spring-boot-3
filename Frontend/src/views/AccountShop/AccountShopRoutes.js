import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./AccountShopIndex"));

const AccountShopRoutes = [
  {
    path:ConstantList.ROOT_PATH + "account-shop",
    exact:true,
    component:ViewComponent,
  },
];

export default AccountShopRoutes;
