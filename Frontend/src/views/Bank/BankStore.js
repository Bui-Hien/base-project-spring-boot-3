import { makeAutoObservable, runInAction } from "mobx";
import { deleteBank, deleteMultipleBankByIds, getBankById, pagingBank, saveBank, } from "./BankService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import BankDto from "../../common/dto/BankDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class BankStore {
  intactSearchObject = {
    ... new SearchObject ()
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new BankDto ();
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
    this.selectedRow = new BankDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingBank = async () => {
    try {
      const {data} = await pagingBank (this.searchObject);
      runInAction (() => {
        this.dataList = data?.data?.content || [];
        this.totalElements = data?.data?.totalElements || 0;
        this.totalPages = data?.data?.totalPages || 0;
      });
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.pagingBank ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingBank ();
  };
  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getBankById (id);
        this.selectedRow = {
          ... new BankDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new BankDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new BankDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
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

  handleDeleteList = () => {
    this.openConfirmDeleteListPopup = true;
  };

  handleConfirmDelete = async () => {
    try {
      const {data} = await deleteBank (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingBank ();
      this.handleClose ();
      return data;
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleConfirmDeleteMultiple = async () => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);
      await deleteMultipleBankByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingBank ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveBank = async (data) => {
    try {
      await saveBank (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingBank ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };
  handleSetSearchObject = (searchObject) => {
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
