import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import SystemStatisticToolbar from "./SystemStatisticToolbar";
import DailyStatisticsChart from "./DailyStatisticsChart";
import { Box, Tab, Tabs } from "@mui/material";
import MonthlyStatisticsChart from "./MonthlyStatisticsChart";
import YearlyStatisticsChart from "./YearlyStatisticsChart";
import { ListSystemStatisticTab } from "../../LocalConstants";
import SystemStatisticForm from "./SystemStatisticForm";


function SystemStatisticIndex () {
  const {systemStatisticStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openCreateEditPopup,
    resetStore
  } = systemStatisticStore;

  useEffect (() => {
    return resetStore
  }, []);
  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.admin.title")},
            {name:t ("navigation.admin.systemStatistic")}
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <SystemStatisticToolbar/>
          </div>
          <div className={"col-span-12"}>
            <SystemStatisticTabComponent/>
          </div>
        </div>
        {openCreateEditPopup && (
            <SystemStatisticForm/>
        )}
      </div>
  );
}

const SystemStatisticTabComponentBase = () => {
  const {systemStatisticStore} = useStore ();
  const {currentTab, setCurrentTab} = systemStatisticStore;

  const listTab = [
    {
      value:ListSystemStatisticTab.DAILY.value,
      name:ListSystemStatisticTab.DAILY.name,
      component:<DailyStatisticsChart/>,
    },
    {
      value:ListSystemStatisticTab.MONTHLY.value,
      name:ListSystemStatisticTab.MONTHLY.name,
      component:<MonthlyStatisticsChart/>,
    },
    {
      value:ListSystemStatisticTab.YEARLY.value,
      name:ListSystemStatisticTab.YEARLY.name,
      component:<YearlyStatisticsChart/>,
    },
  ];

  const handleChange = (event, newValue) => {
    setCurrentTab (newValue);
  };

  return (
      <Box>
        <Tabs
            value={currentTab}
            onChange={handleChange}
            aria-label="user tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom:1,
              borderColor:"divider",
              mb:2,
              ".MuiTab-root":{
                minWidth:"unset",
                textTransform:"none",
                padding:"8px 16px",
                fontWeight:500,
                color:"text.secondary",
              },
              ".Mui-selected":{
                color:"primary.main",
                fontWeight:600,
                borderBottom:"2px solid",
                borderColor:"primary.main",
              },
            }}
        >
          {listTab.map ((tab, index) => (
              <Tab
                  key={tab.value ?? index}
                  value={tab.value}
                  label={tab.name}
                  className="!p-3 !min-w-0"
                  id={`simple-tab-${index}`}
                  aria-controls={`simple-tabpanel-${index}`}
              />
          ))}
        </Tabs>

        <Box>
          {listTab.map (
              (tab) =>
                  currentTab === tab.value && (
                      <Box
                          key={tab.value}
                          role="tabpanel"
                          id={`simple-tabpanel-${tab.value}`}
                          aria-labelledby={`simple-tab-${tab.value}`}
                          sx={{p:2}}
                      >
                        {tab.component}
                      </Box>
                  )
          )}
        </Box>
      </Box>
  );
};

const SystemStatisticTabComponent = memo (observer (SystemStatisticTabComponentBase));

export default memo (observer (SystemStatisticIndex));
