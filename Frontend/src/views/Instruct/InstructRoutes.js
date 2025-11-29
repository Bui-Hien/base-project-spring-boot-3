import { lazy } from "react";
import ConstantList from "../../appConfig";

const ViewComponent = lazy (() => import("./InstructIndex"));
const ViewInstructItem = lazy (() => import("./InstructViewDetailItem"));

const InstructRoutes = [
  {
    path:ConstantList.ROOT_PATH + "instruct",
    exact:true,
    component:ViewComponent,
  },

  {
    path:ConstantList.ROOT_PATH + "instruct/view/:id",
    exact:true,
    component:ViewInstructItem,
  }
];

export default InstructRoutes;
