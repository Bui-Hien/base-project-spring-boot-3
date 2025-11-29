import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./WalletIndex"));

const WalletRoutes = [
  {
    path:ConstantList.ROOT_PATH + "seller/wallet",
    exact:true,
    component:ViewComponent,
  },
];

export default WalletRoutes;
