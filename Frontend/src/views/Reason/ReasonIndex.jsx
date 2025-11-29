import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import ReasonForm from "./ReasonForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import ReasonList from "./ReasonList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import ReasonToolbar from "./ReasonToolbar";

function ReasonIndex () {
  const {reasonStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openConfirmDeleteListPopup,
    openConfirmDeletePopup,
    openCreateEditPopup,
    handleClose,
    handleConfirmDelete,
    handleConfirmDeleteMultiple,
    pagingReason,
    resetStore
  } = reasonStore;

  useEffect (() => {
    pagingReason ()
    return resetStore
  }, []);
  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.admin.title")},
            {name:t ("navigation.admin.reason")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <ReasonToolbar/>
          </div>
          <div className={"col-span-12"}>
            <ReasonList/>
          </div>
        </div>

        {openCreateEditPopup && (
            <ReasonForm/>
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

export default memo (observer (ReasonIndex));
