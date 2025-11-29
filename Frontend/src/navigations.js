import i18next from "i18next";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StoreIcon from "@mui/icons-material/Store";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { SystemRole } from "./LocalConstants";

const iconStyle = "!size-6 !text-white";

export const navigations = [
  // 👤 User
  {
    name:i18next.t ("navigation.home"),
    icon:<HomeIcon className={iconStyle}/>,
    path:"/home",
    isVisible:true,
  },
  {
    name:i18next.t ("navigation.buyNow"),
    icon:<ShoppingCartIcon className={iconStyle}/>,
    path:"/account-shop",
    isVisible:true,
  },
  {
    name:i18next.t ("navigation.guarantee"),
    icon:<ShieldOutlinedIcon className={iconStyle}/>,
    path:"/guarantee",
    isVisible:true,
  },
  {
    name:i18next.t ("navigation.notification"),
    icon:<NotificationsActiveIcon className={iconStyle}/>,
    path:"/notification",
    isVisible:true,
  },
  {
    name:i18next.t ("navigation.instruction"),
    icon:<MenuBookIcon className={iconStyle}/>,
    path:"/instruct",
    isVisible:true,
  },
  {
    name:i18next.t ("navigation.deposit"),
    icon:<AccountBalanceWalletIcon className={iconStyle}/>,
    path:"/deposit",
    isVisible:true,
    auth:[
      SystemRole.ROLE_USER,
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
  {
    name:i18next.t ("navigation.order"),
    icon:<ReceiptLongIcon className={iconStyle}/>,
    path:"/order",
    isVisible:true,
    auth:[
      SystemRole.ROLE_USER,
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
  {
    name:i18next.t ("navigation.transaction"),
    icon:<SwapHorizIcon className={iconStyle}/>,
    path:"/transaction",
    isVisible:true,
    auth:[
      SystemRole.ROLE_USER,
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
  },
  // 💼 Seller
  {
    name:i18next.t ("navigation.sellerManagement.title"),
    icon:<StoreIcon className={iconStyle}/>,
    isVisible:true,
    auth:[
      SystemRole.ROLE_SELLER,
      SystemRole.ROLE_MANAGER,
      SystemRole.ROLE_ADMIN,
    ],
    children:[
      {
        name:i18next.t ("navigation.sellerManagement.dashboard"),
        path:"/seller/account-statistics",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.sellerManagement.accountList"),
        path:"/seller/account",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.sellerManagement.soldList"),
        path:"/seller/order",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.sellerManagement.complaint"),
        path:"/seller/report",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.sellerManagement.wallet"),
        path:"/seller/wallet",
        isVisible:true,
      },
    ],
  },

  // 🧑‍💼 Admin / Manager
  {
    name:i18next.t ("navigation.admin.title"),
    icon:<AdminPanelSettingsIcon className={iconStyle}/>,
    isVisible:true,
    auth:[SystemRole.ROLE_ADMIN, SystemRole.ROLE_MANAGER],
    children:[
      {
        name:i18next.t ("navigation.admin.dashboard"),
        path:"/admin/account-statistics",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.systemStatistic"),
        path:"/admin/system-statistic",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.accountCategory"),
        path:"/admin/account-category",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.accountList"),
        path:"/admin/account",
        isVisible:true,
      },
      {
        name:i18next.t ("Khiếu nại"),
        path:"/admin/report",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.transaction"),
        path:"/admin/transaction",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.systemUser"),
        path:"/admin/system-user",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.post"),
        path:"/admin/post",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.notification"),
        path:"/admin/notification",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.reason"),
        path:"/admin/reason",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.vipLevel"),
        path:"/admin/vip-level",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.bank"),
        path:"/admin/bank",
        isVisible:true,
      },
      {
        name:i18next.t ("navigation.admin.systemConfig"),
        path:"/admin/system-config",
        isVisible:true,
      },
    ],
  },
];
