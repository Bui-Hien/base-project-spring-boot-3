import {lazy} from "react";
import ConstantList from "../../appConfig";
import {SystemRole} from "../../LocalConstants";

const ViewComponent = lazy(() => import("./AccountCategoryIndex"));

const AccountCategoryRoutes = [
    {
        path: ConstantList.ROOT_PATH + "admin/account-category",
        exact: true,
        component: ViewComponent,
        auth: [SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    },
];

export default AccountCategoryRoutes;
