import React, { memo } from "react";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, ButtonGroup, Collapse } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import CommonPagingAutocomplete from "../../common/Form/CommonPagingAutocomplete";
import { pagingUser } from "../User/UserService";
import { useFormikContext } from "formik";
import CommonSelectInput from "../../common/Form/CommonSelectInput";
import { TransactionStatus } from "../../LocalConstants";

function TransactionFilter () {
  const {transactionStore} = useStore ();
  const {
    isOpenFilter,
    handleFilter,
    handleCloseFilter,
    intactSearchObject,
  } = transactionStore;

  const {setFieldValue} = useFormikContext ();

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
          <div className="grid grid-cols-12 gap-4">
            <div
                className="col-span-12 sm:col-span-4 md:col-span-3">
              <CommonSelectInput
                  label="Trạng thái giao dịch"
                  name="status"
                  options={TransactionStatus.getListData ()}
              />
            </div>
            <div
                className="col-span-12 sm:col-span-4 md:col-span-3">
              <CommonPagingAutocomplete
                  label="Người dùng"
                  name="user"
                  getOptionLabel={(option) => option?.username || ""}
                  api={pagingUser}
                  handleOnChange={(value) => {
                    setFieldValue ("user", value);
                    setFieldValue ("userId", value?.id || null);
                  }}
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
  )
      ;
}

export default memo (observer (TransactionFilter));
