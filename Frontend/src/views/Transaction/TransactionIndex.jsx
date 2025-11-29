import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import TransactionList from "./TransactionList";
import TransactionToolbar from "./TransactionToolbar";
import ReportPopup from "./ReportPopup/ReportPopup";

function TransactionIndex () {
  const {transactionStore} = useStore ();
  const {t} = useTranslation ();

  const {
    handleSetSearchObject,
    pagingTransaction,
    resetStore,
  } = transactionStore;

  useEffect (() => {
    handleSetSearchObject ({isCurrent:true})
    pagingTransaction ()
    return resetStore
  }, []);
  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.transaction")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <TransactionToolbar/>
          </div>

          <div className={"col-span-12"}>
            <TransactionList/>
          </div>
        </div>
      </div>
  );
}

export default memo (observer (TransactionIndex));
