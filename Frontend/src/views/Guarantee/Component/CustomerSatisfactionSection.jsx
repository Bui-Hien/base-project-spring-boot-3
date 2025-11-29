import React from "react";
import { Check, Headphones, Zap } from "lucide-react";
import ConstantList from "../../../appConfig";

const CustomerSatisfactionSection = () => {
  return (
      <section className="w-full bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
              Sự hài lòng của bạn, lời hứa của chúng tôi
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <p className="text-slate-600 text-base lg:text-lg leading-relaxed max-w-2xl">
            Tại <span className="font-bold text-violet-600">{ConstantList.APP_NAME}</span>, chúng tôi luôn mang đến{" "}
            <span className="italic font-semibold">niềm vui trực tiếp</span> cho trải nghiệm chơi game của bạn.
            Khi bạn mua hàng, bạn muốn nó <strong>nhanh chóng, dễ dàng và an toàn</strong> —
            và đó chính xác là điều chúng tôi cung cấp!
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
            <li className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 px-6 py-6 font-semibold text-violet-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6"/>
                <span>Giao hàng ngay lập tức</span>
              </div>
            </li>
            <li className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 px-6 py-6 font-semibold text-green-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6"/>
                <span>Giá tốt nhất trên thị trường</span>
              </div>
            </li>
            <li className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-6 font-semibold text-blue-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6"/>
                <span>Hỗ trợ trực tiếp 24/7</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
  );
};

export default CustomerSatisfactionSection;
