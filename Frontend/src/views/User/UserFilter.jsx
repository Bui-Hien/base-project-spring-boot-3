import React, { memo } from 'react';
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { Button, ButtonGroup, Collapse } from "@mui/material";
import CommonSelectInput from "../../common/Form/CommonSelectInput";

function UserFilter () {
  const {userStore} = useStore ();
  const {
    isOpenFilter,
    handleFilter,
    handleCloseFilter,
    intactSearchObject
  } = userStore;

  function handleResetFilter () {
    const newSearchObject = {
      ... JSON.parse (JSON.stringify (intactSearchObject)),
    };
    handleFilter (newSearchObject);
  }

  return (
      <Collapse in={isOpenFilter} className="filterPopup">
        <div className="w-full pt-4">
          {/* Khối lọc */}
          <div className="grid grid-cols-12 gap-4 justify-start">
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              {/*  <CommonPagingAutocomplete*/}
              {/*      label="Danh mục tài khoản"*/}
              {/*      name="accountCategories"*/}
              {/*      api={pagingAccountCategory}*/}
              {/*      multiple*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">*/}
              {/*  <CommonPagingAutocomplete*/}
              {/*      label="Vip"*/}
              {/*      name="vipLevel"*/}
              {/*      api={pagingVipLevel}*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className="col-span-12 sm:col-span-6md:col-span-4 lg:col-span-3">*/}
              {/*  <CommonPagingAutocomplete*/}
              {/*      label="Quyền hạn"*/}
              {/*      name="roles"*/}
              {/*      api={pagingRole}*/}
              {/*      multiple*/}
              {/*  />*/}
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonSelectInput
                  hideNullOption
                  label="Loại tài khoản bán hàng"
                  name="isTrusted"
                  options={
                    [
                      {value:-1, name:"Tất cả tài khoản"},
                      {value:true, name:"Tài khoản tin cậy"},
                      {value:false, name:"Tài khoản thông thường"}
                    ]}
              />
            </div>
          </div>

          {/* Nút hành động */}
          <div className="w-full flex justify-end pt-4 border-t mt-4">
            <ButtonGroup
                color="container"
                aria-label="outlined primary button group"
            >
              <Button onClick={handleResetFilter} startIcon={<RotateLeftIcon/>}>
                Đặt lại
              </Button>
              <Button
                  type="button"
                  onClick={handleCloseFilter}
                  startIcon={<HighlightOffIcon/>}
              >
                Đóng bộ lọc
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Collapse>

  );
}

export default memo (observer (UserFilter));
