import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import OrderList from "./OrderList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import OrderToolbar from "./OrderToolbar";
import ReportForm from "../Report/ReportForm";
import { ReportStatus } from "../../LocalConstants";

function OrderIndex () {
  const {orderStore, reportStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openConfirmDeleteListPopup,
    openConfirmDeletePopup,
    handleClose,
    handleConfirmDelete,
    handleConfirmDeleteMultiple,
    handleSetSearchObject,
    pagingOrder,
    resetStore,
    selectedRow,
  } = orderStore;

  const {
    openCreatePopup,
    saveReport,
    handleClose:handleCloseReportStore,
    selectedRow:selectedRowReportStore,
    handleUpdateStatus,
    openUpdateStatusPopup,
  } = reportStore;

  useEffect (() => {
    handleSetSearchObject ({isBuyer:true})
    pagingOrder ()
    return () => {
      resetStore ();
    }
  }, []);

  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.order")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <OrderToolbar/>
          </div>

          <div className={"col-span-12"}>
            <OrderList isBuyer={true}/>
          </div>
        </div>

        {openCreatePopup && (
            <ReportForm
                handleClose={handleCloseReportStore}
                handleSave={async (values) => {
                  await saveReport (values);
                  await pagingOrder ();
                }}
                innitValue={{
                  ... selectedRowReportStore,
                  order:selectedRow
                }}
                open={openCreatePopup}
            />
        )}

        {openConfirmDeletePopup && (
            <AlertDialog
                open={openConfirmDeletePopup}
                onConfirmDialogClose={handleClose}
                onYesClick={handleConfirmDelete}
                title={t ("confirm_dialog.delete.title")}
                text={t ("confirm_dialog.delete.text")}
                agree={t ("confirm_dialog.delete.agree")}
                cancel={t ("confirm_dialog.delete.cancel")}
            />
        )}

        {openUpdateStatusPopup && (
            <AlertDialog
                open={openUpdateStatusPopup}
                onConfirmDialogClose={handleCloseReportStore}
                onYesClick={async () => {
                  await handleUpdateStatus (ReportStatus.COMPLETED.value);
                  await pagingOrder ();
                }}
                title={t ("Xác nhận hoàn thành report")}
                text={t ("Bạn muốn hoàn thành report này?")}
                agree={t ("Đồng ý")}
                cancel={t ("Cancel")}
            />
        )}

        {openConfirmDeleteListPopup && (
            <AlertDialog
                open={openConfirmDeleteListPopup}
                onConfirmDialogClose={handleClose}
                onYesClick={handleConfirmDeleteMultiple}
                title={t ("confirm_dialog.delete_list.title")}
                text={t ("confirm_dialog.delete_list.text")}
                agree={t ("confirm_dialog.delete_list.agree")}
                cancel={t ("confirm_dialog.delete_list.cancel")}
            />
        )}
      </div>
  );
}

export default memo (observer (OrderIndex));
