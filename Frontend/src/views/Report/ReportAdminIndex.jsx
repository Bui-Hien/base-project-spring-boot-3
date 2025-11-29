import React, {memo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import ReportForm from "./ReportForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import ReportList from "./ReportList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import ReportToolbar from "./ReportToolbar";
import {ReportStatus} from "../../LocalConstants";

function ReportIndex() {
    const {reportStore} = useStore();
    const {t} = useTranslation();

    const {
        openConfirmDeleteListPopup,
        openConfirmDeletePopup,
        openCreateEditPopup,
        openConfirmRefundBuyerPopup,
        openConfirmRefundSellerPopup,
        handleClose,
        handleConfirmDelete,
        handleConfirmDeleteMultiple,
        handleConfirmRefundBuyer,
        handleConfirmRefundSeller,
        pagingReport,
        saveReport,
        selectedRow,
        resetStore,
        openUpdateStatusPopup,
        handleUpdateStatus
    } = reportStore;

    useEffect(() => {
        pagingReport()
        return resetStore
    }, []);
    return (
        <div className="content-index">
            <div className="">
                <CommonBreadcrumb routeSegments={[
                    {name: t("navigation.sellerManagement.title")},
                    {name: t("navigation.sellerManagement.complaint")},
                ]}/>
            </div>
            <div className="index-card grid grid-cols-12 px-4">
                <div className={"col-span-12"}>
                    <ReportToolbar/>
                </div>
                <div className={"col-span-12"}>
                    <ReportList isAdmin={true}/>
                </div>
            </div>

            {openUpdateStatusPopup && (
                <AlertDialog
                    open={openUpdateStatusPopup}
                    onConfirmDialogClose={handleClose}
                    onYesClick={() => {
                        handleUpdateStatus(ReportStatus.COMPLETED.value)
                    }}
                    title={t("Xác nhận hoàn thành report")}
                    text={t("Bạn muốn hoàn thành report này?")}
                    agree={t("Đồng ý")}
                    cancel={t("Cancel")}
                />
            )}
            {openCreateEditPopup && (
                <ReportForm
                    handleClose={handleClose}
                    handleSave={saveReport}
                    innitValue={selectedRow}
                    open={openCreateEditPopup}
                    disabled={true}
                />
            )}

            {openConfirmDeletePopup && (
                <AlertDialog
                    open={openConfirmDeletePopup}
                    onConfirmDialogClose={handleClose}
                    onYesClick={handleConfirmDelete}
                    title={t("confirm_dialog.delete.title")}
                    text={t("confirm_dialog.delete.text")}
                    agree={t("confirm_dialog.delete.agree")}
                    cancel={t("confirm_dialog.delete.cancel")}
                />
            )}

            {openConfirmDeleteListPopup && (
                <AlertDialog
                    open={openConfirmDeleteListPopup}
                    onConfirmDialogClose={handleClose}
                    onYesClick={handleConfirmDeleteMultiple}
                    title={t("confirm_dialog.delete_list.title")}
                    text={t("confirm_dialog.delete_list.text")}
                    agree={t("confirm_dialog.delete_list.agree")}
                    cancel={t("confirm_dialog.delete_list.cancel")}
                />
            )}

            {openConfirmRefundBuyerPopup && (
                <AlertDialog
                    open={openConfirmRefundBuyerPopup}
                    onConfirmDialogClose={handleClose}
                    onYesClick={handleConfirmRefundBuyer}
                    title={t("Xác nhận hoàn tiền")}
                    text={t("Bạn có chắc chắn muốn hoàn tiền cho người mua không?")}
                    agree={t("Đồng ý")}
                    cancel={t("Hủy")}
                />
            )}

            {openConfirmRefundSellerPopup && (
                <AlertDialog
                    open={openConfirmRefundSellerPopup}
                    onConfirmDialogClose={handleClose}
                    onYesClick={handleConfirmRefundSeller}
                    title={t("Xác nhận hoàn tiền")}
                    text={t("Bạn có chắc chắn muốn hoàn tiền cho người bán không?")}
                    agree={t("Đồng ý")}
                    cancel={t("Hủy")}
                />
            )}
        </div>
    );
}

export default memo(observer(ReportIndex));
