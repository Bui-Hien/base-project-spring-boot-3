import i18next from "i18next";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const iconStyle = "!size-6 !text-white";

export const navigations = [
  {
    name:i18next.t ("navigation.admin.title"),
    icon:<AdminPanelSettingsIcon className={iconStyle}/>,
    isVisible:true,
    // auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    children:[
      {
        name:i18next.t ("navigation.admin.systemUser"),
        path:"/admin/system-user",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.systemConfig"),
        path:"/admin/system-config",
        isVisible:true,
      },
      {
        name:i18next.t ("Quyền"),
        path:"/admin/role",
        isVisible:true,
      },
      {
        name:i18next.t ("Nhóm quyền"),
        path:"/admin/group",
        isVisible:true,
      },
    ],
  },
];
