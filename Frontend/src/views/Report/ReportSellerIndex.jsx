import React, { memo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import ReportForm from "./ReportForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import ReportList from "./ReportList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import ReportToolbar from "./ReportToolbar";
import { Tab, Tabs } from "@mui/material";
import { ReportStatus } from "../../LocalConstants";

function ReportSellerIndex() {
    const {reportStore} = useStore();
    const {t} = useTranslation();

    const {
        openConfirmDeleteListPopup,
        openConfirmDeletePopup,
        openConfirmRefundBuyerPopup,
        openEditPopup,
        handleClose,
        handleConfirmDelete,
        handleConfirmDeleteMultiple,
        handleConfirmRefundBuyer,
        pagingReport,
        saveReport,
        selectedRow,
        currentTab,
        setCurrentTab,
        handleSetSearchObject,
        resetStore
    } = reportStore;

    useEffect(() => {
        handleSetSearchObject ({isSeller:true})
        pagingReport()
        return resetStore
    }, []);


    const handleChange = useCallback((_, newValue) => {
        setCurrentTab(newValue);
    }, [setCurrentTab]);

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
                    <ReportTabComponent
                        currentTab={currentTab}
                        handleChange={handleChange}
                    />
                    <ReportList isSeller={true}/>
                </div>
            </div>

            {openEditPopup && (
                <ReportForm
                    handleClose={handleClose}
                    handleSave={saveReport}
                    innitValue={selectedRow}
                    open={openEditPopup}
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
        </div>
    );
}

const ReportTabComponent = memo(({currentTab, handleChange}) => {
    const tabList = [
        {value: null, name: "Tất cả"},
        {value: ReportStatus.PENDING.value, name: ReportStatus.PENDING.name},
        {value: ReportStatus.COMPLETED.value, name: ReportStatus.COMPLETED.name},
    ];

    return (
        <Tabs
            value={currentTab}
            onChange={handleChange}
            aria-label="report status tabs"
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: 2,
                ".MuiTab-root": {
                    minWidth: "unset",
                    textTransform: "none",
                    padding: "8px 16px",
                    fontWeight: 500,
                    color: "text.secondary",
                },
                ".Mui-selected": {
                    color: "primary.main",
                    fontWeight: 600,
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                },
            }}
        >
            {tabList.map((tab, index) => (
                <Tab
                    key={tab.value ?? index}
                    value={tab.value}
                    label={tab.name}
                    className="!p-3 !min-w-0"
                    id={`report-tab-${index}`}
                    aria-controls={`report-tabpanel-${index}`}
                />
            ))}
        </Tabs>
    );
});

export default memo(observer(ReportSellerIndex));
