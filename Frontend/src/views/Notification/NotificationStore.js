import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteMultipleNotificationByIds,
  deleteNotification,
  getNotificationById,
  pagingNotification,
  pagingSearchPublic,
  saveNotification,
} from "./NotificationService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import NotificationDto from "../../common/dto/NotificationDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class NotificationStore {
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
  selectedRow = new NotificationDto ();
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
    this.selectedRow = new NotificationDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingNotification = async () => {
    try {
      const {data} = await pagingNotification (this.searchObject);
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

  pagingNotificationPublic = async () => {
    try {
      const {data} = await pagingSearchPublic (this.searchObject);
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
    await this.pagingNotification ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingNotification ();
  };
  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getNotificationById (id);
        this.selectedRow = {
          ... new NotificationDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new NotificationDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new NotificationDto ();
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
      const {data} = await deleteNotification (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingNotification ();
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
      await deleteMultipleNotificationByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingNotification ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveNotification = async (data) => {
    try {
      await saveNotification (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingNotification ();
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
