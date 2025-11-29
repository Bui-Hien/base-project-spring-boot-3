import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import BankForm from "./BankForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import BankList from "./BankList";
import AlertDialog from "../../common/CommonConfirmationDialog";
import BankToolbar from "./BankToolbar";


const BankIndex = () => {
  const {bankStore} = useStore ();
  const {t} = useTranslation ();

  const {
    openConfirmDeleteListPopup,
    openConfirmDeletePopup,
    openCreateEditPopup,
    handleClose,
    handleConfirmDelete,
    handleConfirmDeleteMultiple,
    pagingBank,
    resetStore
  } = bankStore;

  useEffect (() => {
    pagingBank ()
    return resetStore
  }, []);
  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.admin.title")},
            {name:t ("navigation.admin.bank")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <BankToolbar/>
          </div>

          <div className={"col-span-12"}>
            <BankList/>
          </div>
        </div>

        {openCreateEditPopup && (
            <BankForm/>
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

export default memo (observer (BankIndex));
