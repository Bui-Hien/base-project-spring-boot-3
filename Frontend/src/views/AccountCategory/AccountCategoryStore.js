import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteAccountCategory,
  deleteMultipleAccountCategoryByIds,
  getAccountCategoryById,
  pagingAccountCategory,
  publicGetAccountCategoryByCode,
  publicPagingAccountCategory,
  saveAccountCategory,
} from "./AccountCategoryService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import AccountCategoryDto from "../../common/dto/AccountCategoryDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class AccountCategoryStore {
  intactSearchObject = {
    ... new SearchObject (),
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new AccountCategoryDto ();
  selectedDataList = [];
  isOpenFilter = false;

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.openCreateEditPopup = false;
    this.selectedRow = new AccountCategoryDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingAccountCategory = async () => {
    try {
      const {data} = await pagingAccountCategory (this.searchObject);
      const result = data?.data ?? {};

      runInAction (() => {
        this.dataList = result.content ?? [];
        this.totalElements = result.totalElements ?? 0;
        this.totalPages = result.totalPages ?? 0;
      });
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };

  publicPagingAccountCategory = async () => {
    try {
      const {data} = await publicPagingAccountCategory (this.searchObject);
      const result = data?.data ?? {};

      runInAction (() => {
        this.dataList = result.content ?? [];
        this.totalElements = result.totalElements ?? 0;
        this.totalPages = result.totalPages ?? 0;
      });
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };

  handleMoreAccountCategory = async () => {
    try {
      if (this.searchObject.pageIndex < this.totalPages) {
        this.searchObject.pageIndex = (this.searchObject.pageIndex ?? 0) + 1;
      } else {
        return;
      }
      const {data} = await publicPagingAccountCategory (this.searchObject);
      const result = data?.data ?? {};

      runInAction (() => {
        this.dataList = [
          ... (this.dataList || []),
          ... (result.content ?? []),
        ];
      });

    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  }

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.pagingAccountCategory ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingAccountCategory ();
  };

  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getAccountCategoryById (id);
        this.selectedRow = {
          ... new AccountCategoryDto (),
          ... data?.data,
        };
      } else {
        this.selectedRow = new AccountCategoryDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new AccountCategoryDto ();
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };
  handleGetPublicByCode = async (code) => {
    try {
      if (code) {
        const {data} = await publicGetAccountCategoryByCode (code);
        this.selectedRow = {
          ... new AccountCategoryDto (),
          ... data?.data,
        };
      } else {
        this.selectedRow = new AccountCategoryDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new AccountCategoryDto ();
      console.error (error)
    }
  };

  handleClose = () => {
    this.openConfirmDeletePopup = false;
    this.openCreateEditPopup = false;
    this.openConfirmDeleteListPopup = false;
  };

  handleDelete = (row) => {
    this.selectedRow = {... row};
    this.openConfirmDeletePopup = true;
  };

  handleSetSelected = (row) => {
    this.selectedRow = {... row};
  };

  handleDeleteList = () => {
    this.openConfirmDeleteListPopup = true;
  };

  handleConfirmDelete = async () => {
    try {
      await deleteAccountCategory (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingAccountCategory ();
      this.handleClose ();
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };

  handleConfirmDeleteMultiple = async () => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);
      await deleteMultipleAccountCategoryByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingAccountCategory ();
      this.handleClose ();
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveAccountCategory = async (data) => {
    try {
      await saveAccountCategory (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingAccountCategory ();
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };

  handleSetSearchObject = (searchObject) => {
    this.searchObject = {
      ... this.searchObject,
      ... searchObject,
    };
  };

  handleCloseFilter = () => {
    this.isOpenFilter = false;
  };

  handleTogglePopupFilter = () => {
    this.isOpenFilter = !this.isOpenFilter;
  };
}
