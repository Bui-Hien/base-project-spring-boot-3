import {lazy} from "react";
import ConstantList from "../../appConfig";
import {SystemRole} from "../../LocalConstants";

const ViewComponent = lazy(() => import("./VipLevelIndex"));

const VipLevelRoutes = [
    {
        path: ConstantList.ROOT_PATH + "admin/vip-level",
        exact: true,
        component: ViewComponent,
        auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    },
];

export default VipLevelRoutes;
