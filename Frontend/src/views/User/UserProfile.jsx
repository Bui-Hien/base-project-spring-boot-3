import React, { memo, useState } from "react";
import { observer } from "mobx-react-lite";
import { Box, Tab, Tabs } from "@mui/material";
import UserInfoTab from "./tab/UserInfoTab";
import ChangePasswordTab from "./tab/ChangePasswordTab";

function UserProfile () {
  return (
      <div className="content-index">
        <div className="index-card grid grid-cols-12 px-4">
          <div className="col-span-12">
            <UserTabComponent/>
          </div>
        </div>
      </div>
  );
}

const UserTabComponent = memo (() => {
  const [currentTab, setCurrentTab] = useState (0);

  const handleChange = (event, newValue) => {
    setCurrentTab (newValue);
  };

  const tabs = [
    {label:"Thông tin cá nhân", component:<UserInfoTab/>},
    {label:"Đổi mật khẩu", component:<ChangePasswordTab/>},
  ];

  return (
      <>
        <Tabs
            value={currentTab}
            onChange={handleChange}
            aria-label="user tabs"
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
          {tabs.map ((tab, index) => (
              <Tab
                  key={index}
                  label={tab.label}
                  className="!p-3 !min-w-0"
                  id={`simple-tab-${index}`}
                  aria-controls={`simple-tabpanel-${index}`}
              />
          ))}
        </Tabs>

        <Box sx={{mt:2}}>{tabs[currentTab]?.component}</Box>
      </>
  );
});

export default memo (observer (UserProfile));
