import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./HomeIndex"));
const HomeRoutes = [
  {
    path:ConstantList.ROOT_PATH + "/home",
    exact:true,
    component:ViewComponent,
  },
];

export default HomeRoutes;