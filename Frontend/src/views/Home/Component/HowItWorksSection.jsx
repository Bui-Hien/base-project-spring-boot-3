import React from "react";
import ConstantList from "../../../appConfig";

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Chọn trò chơi của bạn (Choose your game)",
      desc: "Bắt đầu bằng cách chọn tài khoản R$ phù hợp sau đó chuyển vật phẩm mà bạn cần về tài khoản của bạn.",
      color: "from-blue-50 to-cyan-50 hover:border-blue-300 hover:shadow-md",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="tabler-icon tabler-icon-device-gamepad-2 transition-transform duration-300 group-hover:scale-110 text-blue-600">
            <path d="M12 5h3.5a5 5 0 0 1 0 10h-5.5l-4.015 4.227a2.3 2.3 0 0 1 -3.923 -2.035l1.634 -8.173a5 5 0 0 1 4.904 -4.019h3.4z"></path>
            <path d="M14 15l4.07 4.284a2.3 2.3 0 0 0 3.925 -2.023l-1.6 -8.232"></path>
            <path d="M8 9v2"></path>
            <path d="M7 10h2"></path>
            <path d="M14 10h2"></path>
          </svg>
      )
    },
    {
      title: "Làm theo hướng dẫn (Follow the guide)",
      desc: "Nhấn 'Xem hướng dẫn' để biết từng bước cách nhận vật phẩm nhanh nhất.",
      color: "from-purple-50 to-pink-50 hover:border-purple-300 hover:shadow-md",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="tabler-icon tabler-icon-notebook transition-transform duration-300 group-hover:scale-110 text-purple-600">
            <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
            <path d="M13 8l2 0"></path>
            <path d="M13 12l2 0"></path>
          </svg>
      )
    },
    {
      title: "Giao hàng ngay lập tức (Instant delivery)",
      desc: "Hệ thống tự động đảm bảo item đến tài khoản của bạn chỉ trong vài phút — no delay, no hassle.",
      color: "from-yellow-50 to-orange-50 hover:border-orange-300 hover:shadow-md",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="tabler-icon tabler-icon-bolt transition-transform duration-300 group-hover:scale-110 text-orange-600">
            <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
          </svg>
      )
    },
    {
      title: "Hỗ trợ 24/7 (24/7 Support)",
      desc: "Nhóm support luôn available suốt ngày đêm để giúp bạn giải quyết mọi vấn đề.",
      color: "from-green-50 to-emerald-50 hover:border-green-300 hover:shadow-md",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
               className="tabler-icon tabler-icon-headset transition-transform duration-300 group-hover:scale-110 text-green-600">
            <path d="M4 14v-3a8 8 0 1 1 16 0v3"></path>
            <path d="M18 19c0 1.657 -2.686 3 -6 3"></path>
            <path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z"></path>
            <path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z"></path>
          </svg>
      )
    }
  ];

  return (
      <section className="relative overflow-hidden bg-white py-16">
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage:'linear-gradient(rgba(148,163,184,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.1) 1px, transparent 1px)',
            backgroundSize:'50px 50px'
          }} />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-slate-900">{ConstantList.APP_NAME} hoạt động như thế nào?</h2>
            <p className="text-xl text-slate-600">
              Việc mua hàng trên {ConstantList.APP_NAME} được thiết kế để simple, fast và reliable — chỉ cần vài bước là bạn xong!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
                <div key={idx}
                     className={`group relative flex gap-4 rounded-lg border border-slate-200 bg-gradient-to-br p-6 transition-all duration-300 ${step.color}`}>
                  <div className="flex-shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="mb-2 font-bold text-xl text-slate-900">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
};

export default HowItWorksSection;