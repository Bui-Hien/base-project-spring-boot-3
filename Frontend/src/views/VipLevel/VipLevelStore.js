import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteMultipleVipLevelByIds,
  deleteVipLevel,
  getVipLevelById,
  pagingVipLevel,
  saveVipLevel,
} from "./VipLevelService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import VipLevelDto from "../../common/dto/VipLevelDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class VipLevelStore {
  intactSearchObject = {... new SearchObject ()};
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new VipLevelDto ();
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
    this.selectedRow = new VipLevelDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingVipLevel = async () => {
    try {
      const response = await pagingVipLevel (this.searchObject);
      const result = response.data;
      runInAction (() => {
        this.dataList = result.data.content || [];
        this.totalElements = result.data.totalElements || 0;
        this.totalPages = result.data.totalPages || 0;
      });
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  };

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.pagingVipLevel ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingVipLevel ();
  };
  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getVipLevelById (id);
        this.selectedRow = {
          ... new VipLevelDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new VipLevelDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new VipLevelDto ();
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
      const {data} = await deleteVipLevel (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingVipLevel ();
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
      await deleteMultipleVipLevelByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingVipLevel ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveVipLevel = async (data) => {
    try {
      await saveVipLevel (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingVipLevel ();
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
