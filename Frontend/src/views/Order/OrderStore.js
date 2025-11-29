import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteMultipleOrderByIds,
  deleteOrder,
  exportExcel,
  getOrderById,
  pagingOrder,
  saveOrder
} from "./OrderService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import OrderDto from "../../common/dto/OrderDto";
import ReportStore from "../Report/ReportStore";
import { getMessageResponse, safeClone } from "../../LocalFunction";
import { saveAs } from "file-saver";

export default class OrderStore {
  intactSearchObject = {
    ... new SearchObject (),
    userId:null,
    buyerId:null,
    type:null,
    isSeller:null,
    isBuyer:null,
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new OrderDto ();
  selectedDataList = [];
  isOpenFilter = false;

  loadingExportExcel = false;

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.openCreateEditPopup = false;
    this.selectedRow = new OrderDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingOrder = async () => {
    try {
      const {data} = await pagingOrder (this.searchObject);

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

  handleExportExcel = async () => {
    if (this.totalElements > 0) {
      try {
        this.loadingExportExcel = true;
        const res = await exportExcel (this.searchObject);

        const blob = new Blob ([res.data], {
          type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Lấy header content-disposition (Axios auto lowercase)
        const contentDisposition = res.headers["content-disposition"];
        let fileName = "DanhSachDonHang.xlsx";

        if (contentDisposition) {
          // Hỗ trợ cả dạng: attachment; filename="file.xlsx" và filename*=UTF-8''file.xlsx
          const utf8Match = contentDisposition.match (/filename\*=UTF-8''(.+)/);
          const normalMatch = contentDisposition.match (/filename="(.+)"/);

          if (utf8Match && utf8Match[1]) {
            fileName = decodeURIComponent (utf8Match[1]);
          } else if (normalMatch && normalMatch[1]) {
            fileName = decodeURIComponent (normalMatch[1]);
          }
        }

        saveAs (blob, fileName);
        toast.success (`Export Excel thành công: ${fileName}`);
      } catch (error) {
        console.error ("Export Excel lỗi:", error);
        toast.error ("Export Excel thất bại!");
      } finally {
        this.loadingExportExcel = false;
      }
    } else {
      toast.warning ("Không có dữ liệu để export");
    }
  };

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.pagingOrder ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingOrder ();
  };
  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getOrderById (id);
        this.selectedRow = {
          ... new OrderDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new OrderDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new OrderDto ();
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
      const {data} = await deleteOrder (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingOrder ();
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
      await deleteMultipleOrderByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingOrder ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
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

  saveOrder = async (ojb) => {
    try {
      const {data} = await saveOrder (ojb);
      toast.success (i18n.t ("toast.save_success"));
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };
}
