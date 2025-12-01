import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./GroupIndex"));

const GroupRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/group",
    exact:true,
    component:ViewComponent,
    // auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export default GroupRoutes;
