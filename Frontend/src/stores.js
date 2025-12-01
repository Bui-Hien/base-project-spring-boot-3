import { createContext, useContext } from "react";
import AuthStore from "./auth/AuthStore";
import UserStore from "./views/User/UserStore";
import SystemConfigStore from "./views/SystemConfig/SystemConfigStore";
import CallApiLoadingStore from "./common/Layout/CallApiLoadingStore";
import RoleStore from "./views/Role/RoleStore";
import GroupStore from "./views/Group/GroupStore";

export const store = {
  callApiLoadingStore:new CallApiLoadingStore (),
  systemConfigStore:new SystemConfigStore (),
  userStore:new UserStore (),
  authStore:new AuthStore (),
  roleStore:new RoleStore (),
  groupStore:new GroupStore (),
};

export const StoreContext = createContext (store);

export function useStore () {
  return useContext (StoreContext);
}
