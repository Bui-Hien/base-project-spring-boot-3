import { makeAutoObservable, runInAction } from "mobx";
import "react-toastify/dist/ReactToastify.css";
import { accessToken, getCurrentUser, removeToken } from "./AuthService";
import { toast } from "react-toastify";
import i18next from "i18next";
import { getMessageResponse, safeClone } from "../LocalFunction";
import SignInDto from "../dto/auth/SignInDto";

export default class AuthStore {
  loginObject = safeClone (new SignInDto ());

  roles = [];
  currentUser = null;

  constructor () {
    makeAutoObservable (this);
  }

  getCurrentUser = async () => {
    try {
      const {data} = await getCurrentUser ();
      runInAction (() => {
        this.currentUser = data.data || null;
        this.roles = data.data?.authorities || [];
      });
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

  handleLogout = async () => {
    try {
      const payload = {
        refreshToken:localStorage.getItem ("refresh_token")
      };
      await removeToken (payload);
    } catch (err) {
      console.error ("Error during logout:", err);
    } finally {
      runInAction (() => {
        this.currentUser = null;
        this.roles = [];
      });

      localStorage.removeItem ("access_token");
      localStorage.removeItem ("refresh_token");
    }
  };

  resetStore = () => {
    this.loginObject = safeClone (new SignInDto ());
  };
}