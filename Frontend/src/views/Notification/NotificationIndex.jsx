import React, { memo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import PageFooter from "../../common/Component/PageFooter";
import NoticeSection from "./Component/NoticeSection";
import { useStore } from "../../stores";
import { useTranslation } from "react-i18next";

function NotificationIndex () {
  const {notificationStore} = useStore ();
  const {t} = useTranslation ();

  const {
    pagingNotificationPublic,
    resetStore
  } = notificationStore;

  useEffect (() => {
    pagingNotificationPublic ()
    return () => {
      resetStore ();
    }
  }, []);
  return (
      <div className="content-index bg-slate-50 min-h-screen">
        <div className="">
          <CommonBreadcrumb
              routeSegments={[
                {name:t ("navigation.notification")},
              ]}
          />
        </div>
        <div className="index-card grid grid-cols-12">
          <div className={"col-span-12"}>
            <NoticeSection/>
          </div>
        </div>
      </div>
  );
}

export default memo (observer (NotificationIndex));