import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./PostIndex"));
const ViewComponentForm = lazy (() => import("./PostForm"));

const PostRoutes = [
  {
    path:ConstantList.ROOT_PATH + "admin/post",
    exact:true,
    component:ViewComponent,
    // auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
  {
    path:ConstantList.ROOT_PATH + "admin/post/create",
    exact:true,
    component:ViewComponentForm,
    // auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
  {
    path:ConstantList.ROOT_PATH + "admin/post/edit/:id",
    exact:true,
    component:ViewComponentForm,
    // auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
  },
];

export default PostRoutes;
