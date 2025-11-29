import { makeAutoObservable, runInAction } from "mobx";
import SearchObject from "../../common/dto/search/SearchObject";
import OverallStatisticsDto from "../../common/dto/OverallStatisticsDto";
import { AccountStatisticsType } from "../../LocalConstants";
import { getEndWeek, getMessageResponse, getStartWeek, safeClone } from "../../LocalFunction";
import {
  getAccountStatisticsByUser,
  getOverallStatistics,
  getRevenueByDay,
  getRevenueByMonth
} from "./AccountStatisticsService";

export default class AccountStatisticsStore {
  intactSearchObject = {
    ... safeClone (new SearchObject ()),
    userId:null,
    user:null,
    fromDate:getStartWeek (),
    toDate:getEndWeek (),
    type:AccountStatisticsType.DAILY.value
  };
  searchObject = safeClone (this.intactSearchObject);

  accountStatisticsByUserList = [];
  totalElements = 0;
  totalPages = 0;

  overallStatistics = new OverallStatisticsDto ();
  accountStatisticsRevenueList = [];

  constructor () {
    makeAutoObservable (this);
  }

  handleGetAccountStatisticsByUser = async () => {
    try {
      const {data} = await getAccountStatisticsByUser (this.searchObject);

      runInAction (() => {
        this.accountStatisticsByUserList = data.data.content || [];
        this.totalElements = data.data.totalElements || 0;
        this.totalPages = data.data.totalPages || 0;
      });
      
      // getMessageResponse (data);
    } catch (error) {
      getMessageResponse (error?.response?.data);
    }
  };

  handleGetOverallStatistics = async () => {
    try {
      const {data} = await getOverallStatistics (this.searchObject);
      this.overallStatistics = {
        ... new OverallStatisticsDto (),
        ... data.data,
      };
      // getMessageResponse (data);
    } catch (error) {
      this.overallStatistics = new OverallStatisticsDto ();
      getMessageResponse (error?.response?.data);
    }
  };

  handleGetRevenue = async (type = AccountStatisticsType.DAILY.value) => {
    try {
      if (type === AccountStatisticsType.DAILY.value) {
        const {data} = await getRevenueByDay (this.searchObject);
        this.accountStatisticsRevenueList = data.data || [];
        // getMessageResponse (data);
      } else {
        const {data} = await getRevenueByMonth (this.searchObject);
        this.accountStatisticsRevenueList = data.data || [];
        // getMessageResponse (data);
      }
    } catch (error) {
      this.accountStatisticsRevenueList = [];
      getMessageResponse (error?.response?.data);
    }
  };

  setPageIndex = async (page) => {
    this.searchObject.pageIndex = page;
    await this.handleGetAccountStatisticsByUser ();
  };

  setPageSize = async (size) => {
    this.searchObject.pageSize = size;
    this.searchObject.pageIndex = 1;
    await this.handleGetAccountStatisticsByUser ();
  };
  handleSetSearchObject = (searchObject) => {
    this.searchObject = {
      ... this.searchObject,
      ... searchObject
    };
  };

  handleSetType = async (type) => {
    this.handleSetSearchObject ({type})
    await this.handleGetRevenue (type);
  };

  resetStore = () => {
    this.searchObject = safeClone (this.intactSearchObject);
    this.accountStatisticsByUserList = [];
    this.totalElements = 0;
    this.totalPages = 0;
    this.overallStatistics = new OverallStatisticsDto ();
    this.accountStatisticsRevenueList = [];
  };
}
