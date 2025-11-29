import {lazy} from "react";
import ConstantList from "../../appConfig";
import {SystemRole} from "../../LocalConstants";

const ViewComponent = lazy(() => import("./ReasonIndex"));

const ReasonRoutes = [
    {
        path: ConstantList.ROOT_PATH + "admin/reason",
        exact: true,
        component: ViewComponent,
        auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    },
];

export default ReasonRoutes;
