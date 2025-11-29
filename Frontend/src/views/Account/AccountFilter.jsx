import React, { memo } from 'react';
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, ButtonGroup, Collapse } from "@mui/material";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import CommonPagingAutocomplete from "../../common/Form/CommonPagingAutocomplete";
import { pagingUser } from "../User/UserService";
import { pagingAccountCategory } from "../AccountCategory/AccountCategoryService";
import CommonVNDCurrencyInput from "../../common/Form/CommonVNDCurrencyInput";
import CommonDateTimePicker from "../../common/Form/CommonDateTimePicker";
import CommonSelectInput from "../../common/Form/CommonSelectInput";

function AccountFilter ({handleFilter, isAdmin}) {
  const {accountStore} = useStore ();
  const {
    intactSearchObject,
    isOpenFilter,
    handleCloseFilter
  } = accountStore;

  function handleResetFilter () {
    const newSearchObject = {
      ... intactSearchObject,
    };
    handleFilter (newSearchObject);
  }

  return (
      <Collapse in={isOpenFilter} className="filterPopup">
        <div className="w-full pt-4">
          {/* Khối lọc */}
          <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonPagingAutocomplete
                  label="Loại tài khoản"
                  name="accountCategory"
                  api={pagingAccountCategory}
              />
            </div>
            {isAdmin &&
               <>
                 <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                   <CommonPagingAutocomplete
                       label="Người dùng"
                       name="owner"
                       getOptionLabel={(option) => option?.username || ""}
                       api={pagingUser}
                   />
                 </div>
                 <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                   <CommonSelectInput
                       hideNullOption
                       label="Loại tài khoản bán hàng"
                       name="isTrusted"
                       options={
                         [
                           { value: -1, name: "Tất cả tài khoản" },
                           { value: true, name: "Tài khoản tin cậy" },
                           { value: false, name: "Tài khoản thông thường" }
                         ]}
                   />
                 </div>
               </>
            }
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonVNDCurrencyInput
                  label="Đơn giá từ"
                  name="unitPriceFrom"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonVNDCurrencyInput
                  label="Đơn giá đến"
                  name="unitPriceTo"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonVNDCurrencyInput
                  label="Thành tiền từ"
                  name="totalAmountFrom"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonVNDCurrencyInput
                  label="Thành tiền đến"
                  name="totalAmountTo"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 md:col-start-5 lg:col-span-3">
              <CommonDateTimePicker
                  label="Thời gian tạo từ"
                  name="fromDate"
              />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
              <CommonDateTimePicker
                  label="Thời gian tạo đến"
                  name="toDate"
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

export default memo (observer (AccountFilter));