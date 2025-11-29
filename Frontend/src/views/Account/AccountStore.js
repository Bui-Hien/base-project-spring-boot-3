import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteAccount,
  deleteMultipleAccountByIds,
  getAccountById,
  pagingAccount,
  publicPagingSearchAccount,
  publicPrice,
  saveAccount,
  updateAccountStatusErr,
  updateAccountStatusNew,
} from "./AccountService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import AccountDto from "../../common/dto/AccountDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";
import AccountCategoryStore from "../AccountCategory/AccountCategoryStore";
import OrderStore from "../Order/OrderStore";

export default class AccountStore {
  intactSearchObject = {
    ... new SearchObject (),
    unitPriceFrom:null,
    unitPriceTo:null,
    totalAmountFrom:null,
    totalAmountTo:null,
    accountCategory:null,
    accountCategoryCode:null,
    status:null,
    unitPrice:null,
    isTrusted:null
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  priceList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new AccountDto ();
  selectedDataList = [];
  isOpenFilter = false;
  currentTab = null;
  accountCategoryStore = new AccountCategoryStore ();
  orderStore = new OrderStore ();
  openAccountStatusNew = false;
  openAccountStatusErr = false;

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.openCreateEditPopup = false;
    this.selectedRow = new AccountDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
    this.openAccountStatusNew = false;
    this.openAccountStatusErr = false;
    this.accountCategoryStore.resetStore ();
    this.orderStore.resetStore ();
  };

  handleOpenAccountStatusNew = () => {
    this.openAccountStatusNew = true;
  };
  handleOpenAccountStatusErr = () => {
    this.openAccountStatusErr = true;
  };

  pagingAccount = async () => {
    try {
      const newSearch = {
        ... this.searchObject,
        accountCategory:null,
        owner:null,
        isTrusted:
            this.searchObject.isTrusted === -1? null : this.searchObject.isTrusted,
      }
      const {data} = await pagingAccount (newSearch);
      const result = data?.data ?? {};
      runInAction (() => {
        this.dataList = result.content ?? [];
        this.totalElements = result.totalElements ?? 0;
        this.totalPages = result.totalPages ?? 0;
      });
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  publicPagingSearchAccount = async () => {
    try {
      const newSearch = {
        ... this.searchObject,
        accountCategory:null,
        owner:null,
        isTrusted:
            this.searchObject.isTrusted === -1? null : this.searchObject.isTrusted,
      };

      const {data} = await publicPagingSearchAccount (newSearch);
      const result = data?.data ?? {};
      runInAction (() => {
        this.dataList = result.content ?? [];
        this.totalElements = result.totalElements ?? 0;
        this.totalPages = result.totalPages ?? 0;
      });
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  publicPrice = async () => {
    try {
      const {data} = await publicPrice ();
      runInAction (() => {
        this.priceList = data?.data ?? [];
      });
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  setCurrentTab = async (index) => {
    this.currentTab = index;
    this.handleSetSearchObject ({
      ... this.searchObject,
      status:index
    })
    await this.pagingAccount ()
  }

  setPageIndex = async (page, isPublic = false) => {
    this.searchObject.pageIndex = page;
    if (isPublic) {
      this.publicPagingSearchAccount ();
    } else {
      await this.pagingAccount ();
    }
  };

  setPageSize = async (size, isPublic = false) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    if (isPublic) {
      this.publicPagingSearchAccount ();
    } else {
      await this.pagingAccount ();
    }
  };

  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getAccountById (id);
        this.selectedRow = {
          ... new AccountDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new AccountDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new AccountDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleOpenOrder = async (value) => {
    this.selectedRow = {... value};
    this.orderStore.handleOpenCreateEdit ();
  };

  handleConfirmFormOrder = async () => {
    const value = {
      account:this.selectedRow,
    }

    this.orderStore.handleClose ();
    await this.orderStore.saveOrder (value);
    await this.publicPagingSearchAccount ();
  }

  handleClose = () => {
    this.openConfirmDeletePopup = false;
    this.openCreateEditPopup = false;
    this.openConfirmDeleteListPopup = false;
    this.openAccountStatusNew = false;
    this.openAccountStatusErr = false;
  };

  handleDelete = (row) => {
    this.selectedRow = {... row};
    this.openConfirmDeletePopup = true;
  };

  handleDeleteList = () => {
    this.openConfirmDeleteListPopup = true;
  };

  handleConfirmDelete = async () => {
    try {
      const {data} = await deleteAccount (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingAccount ();
      this.handleClose ();
      return data;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleConfirmDeleteMultiple = async () => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);
      await deleteMultipleAccountByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingAccount ();
      this.handleClose ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveAccount = async (data) => {
    try {
      const response = await saveAccount (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingAccount ();
      return response;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };


  handleUpdateAccountStatusNew = async () => {
    try {
      const accountIds = this.selectedDataList.map ((item) => item.id);

      const response = await updateAccountStatusNew ({
        accountIds
      });
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingAccount ();
      return response;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };


  handleUpdateAccountStatusErr = async () => {
    try {
      const accountIds = this.selectedDataList.map ((item) => item.id);
      const response = await updateAccountStatusErr ({accountIds});
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingAccount ();
      return response;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSetSearchObject = (searchObject) => {
    if (searchObject?.owner?.id) {
      searchObject.ownerId = searchObject?.owner?.id;
    } else {
      searchObject.ownerId = null;
    }
    if (searchObject?.accountCategory?.code) {
      searchObject.accountCategoryCode = searchObject?.accountCategory?.code;
    } else {
      searchObject.accountCategoryCode = null;
    }

    this.searchObject = {
      ... this.searchObject,
      ... searchObject
    };
  };

  handleCloseFilter = () => {
    this.isOpenFilter = false;
  };

  handleTogglePopupFilter = () => {
    this.isOpenFilter = !this.isOpenFilter;
  };
}
