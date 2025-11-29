import { memo } from "react";
import { observer } from "mobx-react-lite";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import PageFooter from "../../common/Component/PageFooter";
import CustomerSatisfactionSection from "./Component/CustomerSatisfactionSection";
import WhyChooseThorrs from "../../common/Component/WhyChooseThorrs";
import DeliveryGuaranteeSection from "./Component/DeliveryGuaranteeSection";
import JoinThorrsSection from "./Component/JoinThorrsSection";
import { useTranslation } from "react-i18next";

const GuaranteeIndex = () => {
  const {t} = useTranslation ();

  return (
      <div className="content-index bg-slate-50 min-h-screen">
        <div className="">
          <CommonBreadcrumb routeSegments={[
            {name:t ("navigation.guarantee")},
          ]}/>
        </div>
        <div className="index-card grid grid-cols-12">
          <div className={"col-span-12"}>
            <CustomerSatisfactionSection/>
            <WhyChooseThorrs/>
            <DeliveryGuaranteeSection/>
            <JoinThorrsSection/>
          </div>
        </div>
      </div>
  );
}

export default memo (observer (GuaranteeIndex));