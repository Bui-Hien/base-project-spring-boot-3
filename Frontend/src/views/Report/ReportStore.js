import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteMultipleReportByIds,
  deleteReport,
  getReportById,
  pagingReport,
  saveReport,
  updateStatus
} from "./ReportService";

import { refundTransactionBuyerToSeller, refundTransactionSellerToBuyer } from "../Order/OrderService"

import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import ReportDto from "../../common/dto/ReportDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class ReportStore {
  intactSearchObject = {
    ... new SearchObject (),
    status:null,
    isSeller:null,
    isBuyer:null
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openEditPopup = false;
  openCreatePopup = false;
  openUpdateStatusPopup = false;
  selectedRow = new ReportDto ();
  selectedDataList = [];
  isOpenFilter = false;
  currentTab = null;
  openConfirmRefundBuyerPopup = false;
  openConfirmRefundSellerPopup = false;
  openPopupReport = false;

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.openEditPopup = false;
    this.openCreatePopup = false;
    this.selectedRow = new ReportDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
    this.currentTab = null;
    this.openPopupReport = false;
  };
  setCurrentTab = async (index) => {
    this.currentTab = index;
    const newSearchObj = {
      ... this.searchObject,
      status:index
    }
    this.handleSetSearchObject ({
      ... newSearchObj,
    })
    await this.pagingReport ();
  }
  pagingReport = async () => {
    try {
      const {data} = await pagingReport (this.searchObject);

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
    await this.pagingReport ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingReport ();
  };

  handleOpenEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getReportById (id);
        this.selectedRow = {
          ... new ReportDto (),
          ... data.data,
        };

      } else {
        this.selectedRow = new ReportDto ();
      }
      this.openEditPopup = true;
    } catch (error) {
      this.selectedRow = new ReportDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };


  handleOpenCreate = async () => {
    this.selectedRow = new ReportDto ();
    this.openCreatePopup = true;
  };


  handleOpenUpdateStatus = async (id) => {
    try {
      if (id) {
        const {data} = await getReportById (id);
        this.selectedRow = {
          ... new ReportDto (),
          ... data.data,
        };
      }
      this.openUpdateStatusPopup = true;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleUpdateStatus = async (status) => {
    try {
      if (status) {
        const obj = {
          status:status,
          id:this.selectedRow?.id
        }
        const {data} = await updateStatus (obj);
        getMessageResponse (data);
      }
      this.openUpdateStatusPopup = false;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleClose = () => {
    this.openConfirmDeletePopup = false;
    this.openCreatePopup = false;
    this.openEditPopup = false;
    this.openConfirmDeleteListPopup = false;
    this.openUpdateStatusPopup = false;
    this.openConfirmRefundBuyerPopup = false;
    this.openConfirmRefundSellerPopup = false;
    this.openPopupReport = false;
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
      const {data} = await deleteReport (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingReport ();
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
      await deleteMultipleReportByIds (ids);
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

  saveReport = async (data) => {
    try {
      await saveReport (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingReport ();
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

  handleOpenRefundBuyer = (row) => {
    this.selectedRow = {... row};
    this.openConfirmRefundBuyerPopup = true;
  };

  handleConfirmRefundBuyer = async () => {
    try {
      const {data} = await refundTransactionSellerToBuyer (this.selectedRow?.order);
      toast.success ("Hoàn tiền cho người mua thành công!");
      this.openConfirmRefundBuyerPopup = false;
      await this.pagingReport ();
      return data;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleOpenRefundSeller = (row) => {
    this.selectedRow = {... row};
    this.openConfirmRefundSellerPopup = true;
  };

  handleConfirmRefundSeller = async () => {
    try {
      const {data} = await refundTransactionBuyerToSeller (this.selectedRow?.order); // Gửi body đúng
      toast.success ("Hoàn tiền cho người bán thành công!");
      this.openConfirmRefundSellerPopup = false;
      await this.pagingReport (); // Refresh lại dữ liệu
      return data;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };
  handleOpenReportPopup = () => {
    this.openPopupReport = true;
  }
}
