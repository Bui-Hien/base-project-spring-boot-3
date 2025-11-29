import React, { memo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import FrequentlyAskedQuestions from "./Component/FrequentlyAskedQuestions";
import WhyChooseThorrs from "../../common/Component/WhyChooseThorrs";
import HowItWorksSection from "./Component/HowItWorksSection";
import ThorRSShop from "./Component/ThorRSShop";
import { useStore } from "../../stores";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

function HomeIndex () {
  const {systemStatisticStore} = useStore ();
  const {handleGetSystemStatisticsUser} = systemStatisticStore;
  const location = useLocation ();

  useEffect (() => {
    handleGetSystemStatisticsUser ();
  }, []);

  useEffect (() => {
    const params = new URLSearchParams (location.search);
    const code = params.get ("code");

    if (code === "active-failed") {
      toast.error ("Kích hoạt tài khoản không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ!");
    } else if (code === "active-success") {
      toast.success ("Tài khoản của bạn đã được kích hoạt thành công!");
    }
    window.history.replaceState({}, "", location.pathname);
  }, [location.search]);

  return (
      <div className="content-index bg-slate-50 min-h-screen">
        <div className="index-card grid grid-cols-12">
          <div className={"col-span-12"}>
            <ThorRSShop/>
            <HowItWorksSection/>
            <WhyChooseThorrs/>
            <FrequentlyAskedQuestions/>
          </div>
        </div>
      </div>
  );
}

export default memo (observer (HomeIndex));