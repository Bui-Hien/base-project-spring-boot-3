import {lazy} from "react";
import ConstantList from "../../appConfig";
import {SystemRole} from "../../LocalConstants";

const ViewComponent = lazy(() => import("./SystemStatisticIndex"));

const SystemStatisticRoutes = [
    {
        path: ConstantList.ROOT_PATH + "admin/system-statistic",
        exact: true,
        component: ViewComponent,
        auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    },
];

export default SystemStatisticRoutes;
