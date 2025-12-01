import UserRoutes from "./views/User/UserRoutes";
import SystemConfigRoutes from "./views/SystemConfig/SystemConfigRoutes";
import RoleRoutes from "./views/Role/RoleRoutes";
import GroupRoutes from "./views/Group/GroupRoutes";

const routes = [
  ... SystemConfigRoutes,
  ... UserRoutes,
  ... RoleRoutes,
  ... GroupRoutes,
];

export default routes;
