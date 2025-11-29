import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import i18n from "i18next";
import WalletDto from "../../common/dto/WalletDto";
import { getOptWallet, getTotalBalanceByUser, getWallet, withdrawTransaction } from "./WalletService";
import { getMessageResponse } from "../../LocalFunction";

export default class WalletStore {
  openWithdrawWalletPopup = false;
  selectedRow = new WalletDto ();
  totalBalance = 0;

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.openWithdrawWalletPopup = false;
    this.selectedRow = new WalletDto ();

  };

  handleOpenPopupWithdraw = () => {
    this.openWithdrawWalletPopup = true;
  }

  handleGetWallet = async () => {
    try {
      const {data} = await getWallet ();
      this.selectedRow = {
        ... new WalletDto (),
        ... data.data,
      };
    } catch (error) {
      this.selectedRow = new WalletDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };


  handleGetTotalBalanceByUser = async () => {
    try {
      const {data} = await getTotalBalanceByUser ();
      this.totalBalance = data?.data || 0;
    } catch (error) {
      this.totalBalance = 0;
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleGetOptWithdrawWallet = async () => {
    try {
      await getOptWallet ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleWithdrawTransaction = async (obj) => {
    try {
      const {data} = await withdrawTransaction (obj);

      if (data?.data?.status < 400) {
        toast.success (i18n.t ("toast.save_success"));
        this.handleClose ();
        return true;
      } else {
        toast.error (data?.data?.message);
        return false;
      }
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
      return false;
    }
  };
  handleClose = () => {
    this.openWithdrawWalletPopup = false;
  };
}
