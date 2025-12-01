import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./RoleIndex"));

const RoleRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/role",
    exact:true,
    component:ViewComponent,
    // auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export default RoleRoutes;
