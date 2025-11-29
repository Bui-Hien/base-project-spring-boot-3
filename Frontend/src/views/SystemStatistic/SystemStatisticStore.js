import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import i18n from "i18next";
import SearchObject from "../../common/dto/search/SearchObject";
import SystemStatisticsDto from "../../common/dto/SystemStatisticsDto";
import {
  getDailyStatistics,
  getMonthlyStatistics,
  getSystemStatisticsMarketingUser,
  getSystemStatisticsUser,
  getYearlyStatistics,
  saveSystemStatistics
} from "./SystemStatisticService";
import { ListSystemStatisticTab } from "../../LocalConstants";
import { getMessageResponse, safeClone } from "../../LocalFunction";

export default class SystemStatisticStore {
  intactSearchObject = {
    ... new SearchObject (),
    date:new Date ()
  };
  searchObject = safeClone (this.intactSearchObject);

  dailyStatisticsChartList = [];
  monthlyStatisticsChartList = [];
  yearlyStatisticsChartList = [];
  openCreateEditPopup = false;
  selectedRow = new SystemStatisticsDto ();
  systemStatisticsUser = new SystemStatisticsDto ();
  currentTab = ListSystemStatisticTab.DAILY.value;

  constructor () {
    makeAutoObservable (this);
  }

  setCurrentTab = (index) => {
    this.currentTab = index;
  }
  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);

    this.dailyStatisticsChartList = [];
    this.monthlyStatisticsChartList = [];
    this.yearlyStatisticsChartList = [];

    this.openCreateEditPopup = false;
    this.selectedRow = new SystemStatisticsDto ();
    this.systemStatisticsUser = new SystemStatisticsDto ();
    this.currentTab = ListSystemStatisticTab.DAILY.value;

  };

  handleGetDailyStatisticsChartList = async () => {
    try {
      const {data} = await getDailyStatistics (this.searchObject);
      this.dailyStatisticsChartList = data?.data || [];
    } catch (error) {
      console.error (error);
      this.dailyStatisticsChartList = [];
      getMessageResponse (error?.response?.data);
    }
  }

  handleGetMonthlyStatisticsList = async () => {
    try {
      const {data} = await getMonthlyStatistics (this.searchObject);
      this.monthlyStatisticsChartList = data?.data || [];
    } catch (error) {
      console.error (error);
      this.dailyStatisticsChartList = [];
      getMessageResponse (error?.response?.data);
    }
  }
  handleGetSystemStatisticsUser = async () => {
    try {
      const {data} = await getSystemStatisticsUser ();
      this.systemStatisticsUser = data?.data;
    } catch (error) {
      console.error (error);
      this.systemStatisticsUser = new SystemStatisticsDto ();
      getMessageResponse (error?.response?.data);
    }
  }

  handleGetYearlyStatisticsList = async () => {
    try {
      const {data} = await getYearlyStatistics (this.searchObject);
      this.yearlyStatisticsChartList = data?.data || [];
    } catch (error) {
      console.error (error);
      this.dailyStatisticsChartList = [];
      getMessageResponse (error?.response?.data);
    }
  }

  handleClose = () => {
    this.openCreateEditPopup = false;
  };

  handleSetSearchObject = (searchObject) => {
    this.searchObject = {
      ... this.searchObject,
      ... searchObject
    };
  };
  handleOpenCreateEdit = async (id) => {
    try {
      const {data} = await getSystemStatisticsMarketingUser ();
      this.systemStatisticsUser = {
        ... new SystemStatisticsDto (),
        ... data.data,
      };
      this.openCreateEditPopup = true;
    } catch (error) {
      this.systemStatisticsUser = new SystemStatisticsDto ();
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };

  saveSystemStatistic = async (data) => {
    try {
      await saveSystemStatistics (data);
      toast.success (i18n.t ("toast.save_success"));
      this.handleClose ();
    } catch (error) {
      console.error (error);
      getMessageResponse (error?.response?.data);
    }
  };
}
