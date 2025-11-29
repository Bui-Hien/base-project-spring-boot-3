import React from "react";
import { Zap } from "lucide-react";
import ConstantList from "../../../appConfig";
import { useNavigate } from "react-router-dom";

const JoinThorrsSection = () => {
  const navigate = useNavigate ();

  return (
      <section className="w-full bg-gradient-to-br from-violet-600 to-purple-700 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8 text-white">
            <h2 className="font-bold text-3xl lg:text-4xl leading-snug">
              Tại sao phải chờ đợi? Hãy tham gia cùng hàng ngàn khách hàng hạnh phúc ngay hôm nay!
            </h2>

            <p className="text-lg leading-relaxed text-violet-100">
              Với {ConstantList.APP_NAME}, bạn không chỉ mua hàng — bạn đang tham gia vào một cộng đồng hướng đến giao dịch
              nhanh chóng, an toàn và vui vẻ. Vậy hãy tiếp tục, thực hiện giao dịch mua đó và để chúng tôi
              chỉ cho bạn cách chúng tôi thực hiện!
            </p>

            <button
                onClick={() => navigate(`/account-shop`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-violet-600 px-8 py-4 font-bold text-base transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Zap className="w-5 h-5"/>
              Mua Ngay
            </button>
          </div>
        </div>
      </section>
  );
};

export default JoinThorrsSection;
