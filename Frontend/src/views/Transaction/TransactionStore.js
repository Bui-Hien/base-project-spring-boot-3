import { makeAutoObservable, runInAction } from "mobx";
import {
  confirmDepositTransaction,
  deleteTransactionsOlderThan,
  pagingTransaction,
  updateAttachment,
  updateListRejectStatusWithdrawTransaction,
  updateStatusWithdrawTransaction,
} from "./TransactionService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import TransactionDto from "../../common/dto/TransactionDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class TransactionStore {
  intactSearchObject = {
    ... new SearchObject (),
    walletId:null,
    wallet:null,
    type:null,
    userId:null,
    user:null,
    isCurrent:null,
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  isOpenFilter = false;
  currentTab = null;
  openWithdraw = false;
  openConfirmDepositTransaction = false;
  openRejectWithdraw = false;
  selectedRow = new TransactionDto ();
  selectedDataList = [];
  openDelete = false;

  constructor () {
    makeAutoObservable (this);
  }

  handleOpenDelete = (state) => {
    this.openDelete = state;
  }

  handleConfirmDelete = async () => {
    try {
      await deleteTransactionsOlderThan (7);
      toast.success ("Xóa thông tin lịch sửa giao dịch thành công")
      this.handleOpenDelete (false)
      await this.pagingTransaction ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  }
  handleOpenWithdraw = (state, value) => {
    this.openWithdraw = state;
    if (value?.id) {
      this.selectedRow = value
    }
    if (!state) {
      this.selectedRow = new TransactionDto ();
    }
  }

  handleOpenConfirmDepositTransaction = (state, value) => {
    this.openConfirmDepositTransaction = state;
    if (value?.id) {
      this.selectedRow = value
    }
  }

  handleSetSelectedRow = (data) => {
    this.selectedRow = data;
  }
  handleConfirmDepositTransaction = async () => {
    try {
      await confirmDepositTransaction (this.selectedRow);
      toast.success ("Cập nhật thông tin thành công")
      this.handleOpenConfirmDepositTransaction (false, null)
      this.pagingTransaction ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  }

  handleOpenRejectWithdraw = (state) => {
    this.openRejectWithdraw = state;
  };

  handleConfirmWithdrawTransaction = async () => {
    try {
      await updateStatusWithdrawTransaction (this.selectedRow);
      toast.success ("Cập nhật thông tin thành công")
      this.handleOpenWithdraw (false, null)
      this.pagingTransaction ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  }

  setCurrentTab = async (index) => {
    this.currentTab = index;
    const newSearchObj = {
      ... this.searchObject,
      type:index
    }
    this.handleSetSearchObject ({
      ... newSearchObj,
    })
    await this.pagingTransaction ();
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.isOpenFilter = false;
    this.currentTab = null;
    this.selectedDataList = [];
    this.openDelete = false;
  };

  pagingTransaction = async () => {
    try {
      const response = await pagingTransaction (this.searchObject);
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
    await this.pagingTransaction ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingTransaction ();
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

  handleFilter = async (values) => {
    this.handleSetSearchObject (values)
    await this.pagingTransaction ();
  }

  handleUpdateAttachment = async (id, fileId) => {
    try {
      if (!fileId) {
        toast.error ("Vui lòng tải hóa đơn.")
      }
      await updateAttachment (id, fileId);
      await this.pagingTransaction ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  }

  handleConfirmRejectListWithdrawTransaction = async (values) => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);

      const newValue = {
        note:values?.note,
        transactionIds:ids
      }

      await updateListRejectStatusWithdrawTransaction (newValue);
      this.selectedDataList = [];
      this.handleOpenRejectWithdraw (false)
      toast.success (i18n.t ("Từ chối rút tiền thành công"));
      await this.pagingTransaction ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };
}
