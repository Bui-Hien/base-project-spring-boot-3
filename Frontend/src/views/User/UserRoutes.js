import { lazy } from "react";
import ConstantList from "../../appConfig";
import { SystemRole } from "../../LocalConstants";

const ViewComponent = lazy (() => import("./UserIndex"));
const ViewComponentResetPassword = lazy (() => import("./ResetPasswordForm"));
const ViewComponentForgotPassword = lazy (() => import("./ForgotPasswordForm"));
const ViewComponentRegisterUser = lazy (() => import("./RegisterUserForm"));
const ViewComponentProfile = lazy (() => import("./UserProfile"));

const UserRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/system-user",
    exact:true,
    component:ViewComponent,
    auth:[SystemRole.ROLE_ADMIN],
  },
  {
    path:ConstantList.RESET_PASSWORD,
    exact:true,
    component:ViewComponentResetPassword,
  },
  {
    path:ConstantList.FORGOT_PASSWORD,
    exact:true,
    component:ViewComponentForgotPassword,
  },
  {
    path:ConstantList.REGISTER,
    exact:true,
    component:ViewComponentRegisterUser,
  },
  {
    path:ConstantList.PROFILE,
    exact:true,
    component:ViewComponentProfile,
    auth:[SystemRole.ROLE_USER, SystemRole.ROLE_SELLER, SystemRole.ROLE_MANAGER, SystemRole.ROLE_ADMIN],
  },
];

export default UserRoutes;
