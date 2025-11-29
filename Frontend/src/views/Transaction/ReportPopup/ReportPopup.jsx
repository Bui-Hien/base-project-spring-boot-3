import React, { memo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import CommonPopupV2 from "../../../common/CommonPopupV2";
import { useStore } from "../../../stores";
import { ReportStatus } from "../../../LocalConstants";
import ReportToolbar from "./ReportToolbar";
import ReportList from "./ReportList";

function ReportPopup () {
  const {reportStore, transactionStore} = useStore ();

  const {
    openPopupReport,
    handleClose,
    pagingReport,
    handleSetSearchObject,
    resetStore
  } = reportStore;

  const {selectedRow} = transactionStore;

  useEffect (() => {
    if (openPopupReport && selectedRow?.id) {
      handleSetSearchObject (
          {
            status:ReportStatus.PENDING.value,
            sellerId:selectedRow?.user?.id
          })
      pagingReport ();
    }
    return resetStore
  }, [openPopupReport]);

  return (
      <CommonPopupV2
          size="lg"
          scroll={"body"}
          open={openPopupReport}
          noDialogContent
          title={`Danh sách báo cáo của người dùng ${selectedRow?.user?.username || ""}`}
          onClosePopup={handleClose}
          noIcon
      >
        <div className="content-index">
          <div className="index-card grid grid-cols-12 px-4">
            <div className={"col-span-12"}>
              <ReportToolbar/>
            </div>
            <div className={"col-span-12"}>
              <ReportList/>
            </div>
          </div>
        </div>
      </CommonPopupV2>
  );
}

export default memo (observer (ReportPopup));
