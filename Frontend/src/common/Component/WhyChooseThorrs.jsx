import React from "react";
import ConstantList from "../../appConfig";

const WhyChooseThorrs = () => {
  return (
      <section className="relative font-store border-t border-slate-200 bg-slate-50">
        <div style={{paddingBottom:"32px"}}>
          <article className="flex w-full flex-col items-start space-y-6">
            <div className="flex w-full items-center justify-center">
              <div className="bloxcart-3xl-container">
                <section className="relative bg-white py-16">
                  <div className="container mx-auto px-4">
                    <h2 className="mb-12 text-center font-bold text-3xl text-slate-900">
                      Tại sao nên chọn {ConstantList.APP_NAME}?
                    </h2>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                      {/* --- Card 1 --- */}
                      <div className="group relative rounded-lg border border-slate-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 transition-all duration-300 hover:border-orange-300 hover:shadow-lg">
                        <div className="mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                               className="tabler-icon tabler-icon-bolt transition-transform duration-300 group-hover:scale-110 text-orange-600">
                            <path d="M13 3v7h6l-8 11v-7H5l8-11"></path>
                          </svg>
                        </div>
                        <h3 className="mb-3 font-semibold text-xl text-slate-900">
                          Nhanh chóng và Đáng tin cậy
                        </h3>
                        <p className="text-slate-600">
                          Hệ thống giao hàng tự động của chúng tôi đảm bảo hàng hóa của bạn được giao gần như ngay lập tức.
                        </p>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
                      </div>

                      {/* --- Card 2 --- */}
                      <div className="group relative rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
                        <div className="mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                               className="tabler-icon tabler-icon-lock transition-transform duration-300 group-hover:scale-110 text-blue-600">
                            <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2H7a2 2 0 0 1 -2 -2v-6z"></path>
                            <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                            <path d="M8 11V7a4 4 0 1 1 8 0v4"></path>
                          </svg>
                        </div>
                        <h3 className="mb-3 font-semibold text-xl text-slate-900">
                          Giao dịch an toàn
                        </h3>
                        <p className="text-slate-600">
                          Chúng tôi sử dụng hệ thống thanh toán đáng tin cậy để giữ dữ liệu của bạn an toàn và bảo mật.
                        </p>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
                      </div>

                      {/* --- Card 3 --- */}
                      <div className="group relative rounded-lg border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 transition-all duration-300 hover:border-green-300 hover:shadow-lg">
                        <div className="mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                               className="tabler-icon tabler-icon-message-2 transition-transform duration-300 group-hover:scale-110 text-green-600">
                            <path d="M8 9h8"></path>
                            <path d="M8 13h6"></path>
                            <path d="M9 18h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-3l-3 3l-3-3z"></path>
                          </svg>
                        </div>
                        <h3 className="mb-3 font-semibold text-xl text-slate-900">
                          Hỗ trợ vô song
                        </h3>
                        <p className="text-slate-600">
                          Đội ngũ trò chuyện trực tuyến 24/7 của chúng tôi luôn sẵn sàng trợ giúp bạn.
                        </p>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
                      </div>

                      {/* --- Card 4 --- */}
                      <div className="group relative rounded-lg border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-lg">
                        <div className="mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                               viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                               className="tabler-icon tabler-icon-apps transition-transform duration-300 group-hover:scale-110 text-purple-600">
                            <path d="M4 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1H4a1 1 0 0 1 -1 -1V5a1 1 0 0 1 1 -1z"></path>
                            <path d="M4 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1H4a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"></path>
                            <path d="M14 14h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z"></path>
                            <path d="M14 7h6"></path>
                            <path d="M17 4v6"></path>
                          </svg>
                        </div>
                        <h3 className="mb-3 font-semibold text-xl text-slate-900">Đa dạng</h3>
                        <p className="text-slate-600">
                          Chúng tôi có mọi thứ bạn cần để nâng cao trải nghiệm chơi game của mình.
                        </p>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </article>
        </div>
      </section>
  );
};

export default WhyChooseThorrs;