import { makeAutoObservable, runInAction } from "mobx";
import { deleteMultipleReasonByIds, deleteReason, getReasonById, pagingReason, saveReason, } from "./ReasonService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import ReasonDto from "../../common/dto/ReasonDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class ReasonStore {
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
  selectedRow = new ReasonDto ();
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
    this.selectedRow = new ReasonDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingReason = async () => {
    try {
      const response = await pagingReason (this.searchObject);
      const result = response.data;
      runInAction (() => {
        this.dataList = result.data.content || [];
        this.totalElements = result.data.totalElements || 0;
        this.totalPages = result.data.totalPages || 0;
      });
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.pagingReason ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingReason ();
  };
  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getReasonById (id);
        this.selectedRow = {
          ... new ReasonDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new ReasonDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new ReasonDto ();
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
      const {data} = await deleteReason (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingReason ();
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
      await deleteMultipleReasonByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingReason ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveReason = async (data) => {
    try {
      await saveReason (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingReason ();
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
