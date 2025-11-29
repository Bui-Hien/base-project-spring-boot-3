import { makeAutoObservable, runInAction } from "mobx";
import {
  changePassword,
  deleteMultipleUserByIds,
  deleteUser,
  enabledUser,
  getUserById,
  pagingUser,
  registerUser,
  saveUser,
  unEnabledUser,
  upDataInfo
} from "./UserService";
import { toast } from "react-toastify";
import i18n from "i18next";
import UserDto from "../../common/dto/UserDto";
import { ListUserTab } from "../../LocalConstants";
import SearchObject from "../../common/dto/search/SearchObject";
import { forgotPassword, resetPassword } from "../../auth/authService";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class UserStore {
  intactSearchObject = {
    ... new SearchObject (),
    isEnabled:null,
    roleIds:[],
    roles:[],
    accountCategoryIds:[],
    accountCategories:[],
    vipLevelId:null,
    vipLevel:null,
    isTrusted:null
  }
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new UserDto ();
  selectedDataList = [];
  isOpenFilter = false;
  currentTab = ListUserTab.ALL.value;
  openPopupUnEnabledUser = false;
  openPopupEnabledUser = false;

  constructor () {
    makeAutoObservable (this);
  }

  setCurrentTab = async (index) => {
    this.currentTab = index;
    const newSearchObj = {
      ... this.searchObject
    }
    if (index === ListUserTab.IS_ENABLED.value) {
      newSearchObj.isEnabled = true;
    } else {
      newSearchObj.isEnabled = false;
    }
    this.handleSetSearchObject ({
      ... newSearchObj,
    })
    await this.pagingUser ();
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.openCreateEditPopup = false;
    this.selectedRow = new UserDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
    this.currentTab = ListUserTab.ALL.value;
  };

  pagingUser = async () => {
    try {
      const newSearch = {
        ... this.searchObject,
        roles:undefined,
        accountCategories:undefined,
        vipLevel:undefined,
        isTrusted:
            this.searchObject.isTrusted === -1 ? null : this.searchObject.isTrusted,
      }
      const response = await pagingUser (newSearch);
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
    await this.pagingUser ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingUser ();
  };

  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getUserById (id);
        this.selectedRow = {
          ... new UserDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new UserDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new UserDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleClose = () => {
    this.openConfirmDeletePopup = false;
    this.openCreateEditPopup = false;
    this.openConfirmDeleteListPopup = false;
    this.openPopupUnEnabledUser = false;
    this.openPopupEnabledUser = false;
  };

  handleDelete = (row) => {
    this.selectedRow = {... row};
    this.openConfirmDeletePopup = true;
  };

  handleDeleteList = () => {
    this.openConfirmDeleteListPopup = true;
  };

  handleOpenPopupUnEnabledUser = () => {
    this.openPopupUnEnabledUser = true;
  }
  handleOpenPopupEnabledUser = () => {
    this.openPopupEnabledUser = true;
  }

  handleConfirmDelete = async () => {
    try {
      const {data} = await deleteUser (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingUser ();
      this.handleClose ();
      return data;
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleEnabledUser = async () => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);
      await enabledUser (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("Khóa tài khoản người dùng thành công"));
      await this.pagingUser ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleUnEnabledUser = async () => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);
      await unEnabledUser (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("Mở khóa tài khoản người dùng thành công"));
      await this.pagingUser ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleConfirmDeleteMultiple = async () => {
    try {
      const ids = this.selectedDataList.map ((item) => item.id);
      await deleteMultipleUserByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("Xóa người dùng thành công"));
      await this.pagingUser ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  saveUser = async (data) => {
    try {
      await saveUser (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingUser ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  updateDataInfo = async (data) => {
    try {
      await upDataInfo (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };


  handleRegisterUser = async (data) => {
    try {
      await registerUser (data);
      toast.success (i18n.t ("Đăng ký tài khoản thành công. Vui lòng vào mail để xác nhận."));
      return true;
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
      return false;
    }
  };

  handleSetSearchObject = (searchObject) => {
    const newSearchObj = {... searchObject};

    if (Array.isArray (searchObject.roles) && searchObject.roles.length > 0) {
      newSearchObj.roleIds = searchObject.roles.map (item => item.id);
    } else {
      newSearchObj.roles = [];
      newSearchObj.roleIds = [];
    }

    if (Array.isArray (searchObject.accountCategories) && searchObject.accountCategories.length > 0) {
      newSearchObj.accountCategoryIds = searchObject.accountCategories.map (item => item.id);
    } else {
      newSearchObj.accountCategories = [];
      newSearchObj.accountCategoryIds = [];
    }

    if (searchObject.vipLevel?.id) {
      newSearchObj.vipLevelId = searchObject?.vipLevel?.id;
    } else {
      newSearchObj.vipLevelId = null;
      newSearchObj.vipLevel = null;
    }

    this.searchObject = newSearchObj;
  };

  handleCloseFilter = () => {
    this.isOpenFilter = false;
  };

  handleTogglePopupFilter = () => {
    this.isOpenFilter = !this.isOpenFilter;
  };

  handleFilter = async (values) => {
    this.handleSetSearchObject (values)
    await this.pagingUser ();
  }

  handleResetPassword = async (values) => {
    try {
      await resetPassword (values);
      return true;
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
      return false;
    }
  };

  handleForgotPassword = async (values) => {
    try {
      const response = await forgotPassword (values);
      if (response?.data?.message) {
        toast.success (response?.data?.message);
      }
      return true;
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
      return false;
    }
  }

  handleChangePassword = async (values) => {
    try {
      const response = await changePassword (values);
      if (response?.data) {
        getMessageResponse (response?.data);
      }
    } catch (error) {
      console.error (error)
      getMessageResponse (error?.response?.data);
    }
  }
}
