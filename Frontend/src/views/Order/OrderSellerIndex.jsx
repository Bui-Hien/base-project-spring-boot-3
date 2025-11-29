import { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import OrderList from "./OrderList";
import OrderToolbar from "./OrderToolbar";

function OrderSellerIndex () {
  const {orderStore} = useStore ();
  const {t} = useTranslation ();

  const {
    pagingOrder,
    handleSetSearchObject,
    resetStore,
  } = orderStore;

  useEffect (() => {
    handleSetSearchObject ({isSeller:true})
    pagingOrder ()
    return () => {
      resetStore ();
    }
  }, []);

  return (
      <div className="content-index">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.sellerManagement.title")},
            {name:t ("navigation.sellerManagement.soldList")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12 px-4">
          <div className={"col-span-12"}>
            <OrderToolbar isSeller={true}/>
          </div>
          <div className={"col-span-12"}>
            <OrderList isSeller={true}/>
          </div>
        </div>
      </div>
  );
}

export default memo (observer (OrderSellerIndex));
