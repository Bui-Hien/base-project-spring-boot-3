import { makeAutoObservable } from "mobx";
import { getUrlVietQr, } from "./DepositService";
import { getMessageResponse } from "../../LocalFunction";
import { clientConfirmDeposit } from "../Transaction/TransactionService";

export default class DepositStore {
  openClientConfirmDeposit = false;
  isConfirmedDeposit = false;
  loading = false;
  paymentUrl = null;
  transactionId = null;

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.openClientConfirmDeposit = false;
    this.loading = false;
    this.paymentUrl = null;
    this.transactionId = null;
  };

  handleOpenClientConfirmDeposit = (state) => {
    this.openClientConfirmDeposit = state;
  }
  handleClientConfirmDeposit = async () => {
    try {
      this.isConfirmedDeposit = true;
      const {data} = await clientConfirmDeposit (this.transactionId);
      getMessageResponse (data);
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  }
  handleGetUrlVietQr = async (amount) => {
    this.loading = true;
    this.isConfirmedDeposit = false;
    try {
      if (amount) {
        const {data} = await getUrlVietQr (amount);
        this.paymentUrl = data?.data?.paymentUrl;
        this.transactionId = data?.data?.transactionId;
      } else {
        this.paymentUrl = null;
        this.transactionId = null;
      }
    } catch (error) {
      this.paymentUrl = null;
      this.transactionId = null;
      console.error (error);
      getMessageResponse (error?.response?.data);
    } finally {
      this.loading = false;
    }
  };
}
