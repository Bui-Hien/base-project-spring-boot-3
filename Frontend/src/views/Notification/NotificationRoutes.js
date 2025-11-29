import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./NotificationIndex"));
const ViewComponentAdmin = lazy (() => import("./NotificationAdminIndex"));

const NotificationRoutes = [
  {
    path:ConstantList.ROOT_PATH + "/notification",
    exact:true,
    component:ViewComponent,
  },
  {
    path:ConstantList.ROOT_PATH + "/admin/notification",
    exact:true,
    component:ViewComponentAdmin,
    auth:[
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  }
];

export default NotificationRoutes;
