import { makeAutoObservable, runInAction } from "mobx";
import { getAllSystemConfig, getSystemConfigById, pagingSystemConfig, saveSystemConfig, } from "../../service/SystemConfigService";
import { toast } from "react-toastify";
import i18n from "i18next";
import SystemConfigDto from "../../dto/SystemConfigDto";
import { ValueType } from "../../LocalConstants";
import LocalStorageService from "../../service/LocalStorageService";
import { getMessageResponse, safeClone } from "../../LocalFunction";
import SearchObject from "../../dto/search/SearchObject";

export default class SystemConfigStore {
  intactSearchObject = {... new SearchObject ()};
  searchObject = safeClone (this.intactSearchObject);
  totalElements = 0;
  totalPages = 0;
  dataList = [];
  openCreateEditPopup = false;
  selectedRow = new SystemConfigDto ();

  constructor () {
    makeAutoObservable (this);
  }

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.totalElements = 0;
    this.totalPages = 0;
    this.dataList = [];
    this.openCreateEditPopup = false;
    this.selectedRow = new SystemConfigDto ();
  };

  pagingSystemConfig = async () => {
    try {
      const {data} = await pagingSystemConfig (this.searchObject);
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

  handleGetAllSystemConfig = async () => {
    try {
      const {data} = await getAllSystemConfig ();

      const list = Array.isArray (data)? data : data?.data ?? [];

      if (list.length > 0) {
        const dataLocal = {};

        for (let item of list) {
          let value = item.value;

          if (typeof value === "string") {
            const lower = value.toLowerCase ().trim ();
            if (lower === "true") value = true;
            else if (lower === "false") value = false;
            else if (!isNaN (Number (value))) value = Number (value);
          }

          dataLocal[item.key] = value;
        }

        LocalStorageService.setItem ("sysConfig", dataLocal);
      } else {
        console.warn ("System config list is empty!");
      }
    } catch (error) {
      console.error ("handleGetAllSystemConfig error:", error);
    }
  };

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.pagingSystemConfig ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.pagingSystemConfig ();
  };
  handleOpenCreateEdit = async (id) => {
    try {
      if (id) {
        const {data} = await getSystemConfigById (id);
        const processedData = {
          ... data.data,
          type:data.data.type ?? null,
          value:(() => {
            if (!data.data.type) return data.data.value;
            const type = data.data.type;

            switch (type) {
              case ValueType.STRING.value:
                return String (data.data.value ?? "");
              case ValueType.INTEGER.value:
                return parseInt (data.data.value ?? 0, 10);
              case ValueType.DECIMAL.value:
                return parseFloat (data.data.value ?? 0);
              case ValueType.DATE.value:
                return data.data.value? new Date (data.data.value) : null;
              case ValueType.BOOLEAN.value:
                return data.data.value === true || data.data.value === "true";
              default:
                return data.data.value;
            }
          }) ()
        };
        this.selectedRow = {
          ... new SystemConfigDto (),
          ... processedData,
        };
      } else {
        this.selectedRow = new SystemConfigDto ();
      }
      this.openCreateEditPopup = true;
    } catch (error) {
      this.selectedRow = new SystemConfigDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  handleClose = () => {
    this.openCreateEditPopup = false;
  };

  saveSystemConfig = async (data) => {
    try {
      const processedData = {
        ... data,
        type:data.type ?? null,
        value:(() => {
          if (!data.type) return data.value;
          const type = data.type;

          switch (type) {
            case ValueType.STRING.value:
              return String (data.value ?? "");
            case ValueType.INTEGER.value:
              return parseInt (data.value ?? 0, 10);
            case ValueType.DECIMAL.value:
              return parseFloat (data.value ?? 0);
            case ValueType.DATE.value:
              return data.value? new Date (data.value) : null;
            case ValueType.BOOLEAN.value:
              return data.value === true || data.value === "true";
            default:
              return data.value;
          }
        }) ()
      };
      await saveSystemConfig (processedData);
      this.handleGetAllSystemConfig ();
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
      await this.pagingSystemConfig ();
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
}
