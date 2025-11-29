import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteMultiplePostByIds,
  deletePost,
  getPostById,
  getPostPublicById,
  pagingPost,
  pagingPostPublic,
  savePost
} from "./PostService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import PostDto from "../../common/dto/PostDto";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class PostStore {
  intactSearchObject = {
    ... new SearchObject (),
    status:null
  };
  searchObject = safeClone (this.intactSearchObject);

  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openConfirmDeletePopup = false;
  openConfirmDeleteListPopup = false;
  openCreateEditPopup = false;
  selectedRow = new PostDto ();
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
    this.selectedRow = new PostDto ();
    this.openConfirmDeletePopup = false;
    this.openConfirmDeleteListPopup = false;
    this.selectedDataList = [];
    this.isOpenFilter = false;
  };

  pagingPost = async () => {
    try {
      const response = await pagingPost (this.searchObject);
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

  pagingPostPublic = async () => {
    try {
      const response = await pagingPostPublic (this.searchObject);
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
    await this.pagingPost ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingPost ();
  };
  handleGetById = async (id) => {
    try {
      if (id) {
        const {data} = await getPostById (id);
        this.selectedRow = {
          ... new PostDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new PostDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new PostDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleGetPublicById = async (id) => {
    try {
      if (id) {
        const {data} = await getPostPublicById (id);
        this.selectedRow = {
          ... new PostDto (),
          ... data.data,
        };
      } else {
        this.selectedRow = new PostDto ();
      }
      return true;
    } catch (error) {
      this.selectedRow = new PostDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
      return false;
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
      const {data} = await deletePost (this.selectedRow.id);
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingPost ();
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
      await deleteMultiplePostByIds (ids);
      this.selectedDataList = [];
      toast.success (i18n.t ("toast.delete_success"));
      await this.pagingPost ();
      this.handleClose ();
    } catch (error) {
      console.log (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleSelectListDelete = (dataList) => {
    this.selectedDataList = dataList;
  };

  savePost = async (data) => {
    try {
      const response = await savePost (data);
      toast.success (i18n.t ("toast.save_success"));
      return response
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
