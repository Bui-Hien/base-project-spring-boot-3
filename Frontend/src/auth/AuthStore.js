import { makeAutoObservable } from "mobx";
import "react-toastify/dist/ReactToastify.css";
import { accessToken, getCurrentUser } from "./authService";
import { toast } from "react-toastify";
import i18next from "i18next";
import { getMessageResponse, safeClone } from "../LocalFunction";

export default class AuthStore {
  intactLoginObject = {
    email:"",
    password:"",
  };
  loginObject = safeClone (this.intactLoginObject);

  roles = [];
  currentUser = null;

  constructor () {
    makeAutoObservable (this);
  }

  getCurrentUser = async () => {
    try {
      const {data} = await getCurrentUser ();
      // Gán currentUser
      this.currentUser = data.data || null;

      // Gán roles là danh sách name
      this.roles = Array.isArray (data.data.roles)
          ? data.data.roles.map (r => r?.name).filter (Boolean)
          : [];
      return this.currentUser;
    } catch (error) {
      console.error (error);
      toast.error (i18next.t ("notLoggedIn"));
      return null;
    }
  }

  handleLogin = async (payload) => {
    try {
      const {data} = await accessToken (payload);
      localStorage.setItem ("access_token", data?.data?.accessToken);
      localStorage.setItem ("refresh_token", data?.data?.refreshToken);
      await this.getCurrentUser ();
      return true;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleLogout = () => {
    localStorage.removeItem ("access_token");
    localStorage.removeItem ("refresh_token");
    this.currentUser = null;
    this.roles = [];
  };
  resetStore = () => {
    this.loginObject = safeClone (this.intactLoginObject);
  };
}