import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./GuaranteeIndex"));

const GuaranteeRoutes = [
  {
    path:ConstantList.ROOT_PATH + "guarantee",
    exact:true,
    component:ViewComponent,
  }
];

export default GuaranteeRoutes;
