import {lazy} from "react";
import ConstantList from "../../appConfig";
import {SystemRole} from "../../LocalConstants";

const ViewComponent = lazy(() => import("./SystemConfigIndex"));

const SystemConfigRoutes = [
    {
        path: ConstantList.ROOT_PATH + "admin/system-config",
        exact: true,
        component: ViewComponent,
        auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    },
];

export default SystemConfigRoutes;
