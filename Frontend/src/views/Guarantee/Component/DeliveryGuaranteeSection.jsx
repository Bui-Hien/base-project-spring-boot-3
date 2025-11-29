import React from "react";
import { Users, Clock, Shield } from "lucide-react";
import ConstantList from "../../../appConfig";

const DeliveryGuaranteeSection = () => {
  const cards = [
    {
      title: `Mua sắm tại ${ConstantList.APP_NAME}`,
      desc: "Chúng tôi đã hoàn thành hàng trăm nghìn đơn hàng với sự hài lòng của khách hàng trên khắp thế giới.",
      icon: Users,
    },
    {
      title: "Giao hàng ngay lập tức",
      desc: "96% đơn hàng được giao ngay lập tức, giúp bạn tiếp tục công việc chỉ trong vài phút.",
      icon: Clock,
    },
    {
      title: "Yêu cầu hoặc được hoàn lại tiền",
      desc: "Bạn chưa yêu cầu hoàn tiền? Đừng lo, bạn sẽ được hoàn lại toàn bộ tiền, đảm bảo, trong trường hợp chúng tôi ngừng cung cấp dịch vụ.",
      icon: Shield,
    },
  ];

  return (
      <section className="w-full bg-white py-16 lg:py-24 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Đảm bảo giao hàng của chúng tôi
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-2xl text-base lg:text-lg">
              Chúng tôi hiểu — chờ đợi không vui. Đó là lý do tại sao chúng tôi hứa rằng nếu bạn không nhận
              đơn hàng trong vòng 10 phút, bạn sẽ được hoàn lại toàn bộ tiền. Đơn giản vậy thôi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                  <div
                      key={index}
                      className="rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-slate-50 to-white"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="font-bold text-lg text-slate-900">{card.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </section>
  );
};
export default DeliveryGuaranteeSection;
