import React from "react";
import ConstantList from "../../../appConfig";

const FrequentlyAskedQuestions = () => {
  return (
      <section id="frequently-asked-questions" className="relative py-16 font-store bg-white">
        <div className="bloxcart-store-container">
          <div className="flex flex-row items-start justify-start gap-14 max-w-6xl mx-auto px-4">
            <article className="flex w-full flex-col items-start">
              <h2 className="max-w-2xl font-bold text-3xl text-slate-900">
                Những câu hỏi thường gặp
              </h2>
              <p className="mt-2 pb-5 font-light text-base text-slate-600 capitalize">
                Bạn có thắc mắc không? Chúng tôi có câu trả lời!
              </p>

              <footer className="my-8 flex w-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4 py-12 pb-24 text-center rounded-xl border border-slate-200 shadow-sm">
                <h3 className="mb-4 font-bold text-slate-900 text-xl tracking-wide">
                  Chúng tôi không liên kết với R$ Corporation, Big Games hoặc Uplift Games
                </h3>
                <p className="mb-4 max-w-4xl text-center font-medium text-base text-slate-700 leading-relaxed">
                  {ConstantList.APP_NAME}.COM không liên kết, liên kết hoặc hợp tác với Roblox Corporation, Big Games, Uplift Games hoặc bất kỳ nhà phát triển trò chơi nào khác theo bất kỳ cách nào. {ConstantList.APP_NAME}.COM là một nền tảng độc lập cho việc bán skin kỹ thuật số & vật phẩm và không được R$ Corporation, Big Games, Uplift Games hoặc bất kỳ chi nhánh nào của họ quyền, xác nhận hoặc tài trợ. Tất cả các nhãn hiệu và bản quyền đều thuộc về chủ sở hữu tương ứng của họ.
                </p>
              </footer>

              <div className="mx-auto flex w-full flex-col lg:flex-row gap-8">
                {/* --- Cột trái --- */}
                <div className="flex-1 space-y-4">
                  <div className="mb-6">
                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Giao hàng mất bao lâu?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Giao hàng gần như ngay lập tức! Trong hầu hết các trường hợp, bạn sẽ nhận được hàng trong vòng vài phút sau khi hoàn tất giao dịch mua.
                      </div>
                    </details>

                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Tôi phải làm gì nếu không nhận được hàng?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Nếu bạn không nhận được hàng trong thời gian hợp lý, vui lòng liên hệ với bộ phận hỗ trợ trò chuyện trực tiếp 24/7 của chúng tôi. Họ sẽ hỗ trợ bạn ngay lập tức để đảm bảo đơn hàng của bạn được giao.
                      </div>
                    </details>

                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Tôi có thể được hoàn lại tiền nếu tôi thay đổi quyết định không?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Việc hoàn tiền chỉ được cung cấp trong một số điều kiện nhất định. Vui lòng kiểm tra chính sách hoàn tiền của chúng tôi để biết chi tiết hoặc liên hệ với nhóm hỗ trợ của chúng tôi để làm rõ.
                      </div>
                    </details>

                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Những mặt hàng này có an toàn để mua không?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Có! Tất cả các mặt hàng trên R$ đều được xử lý thông qua hệ thống an toàn và chúng tôi đảm bảo trải nghiệm giao dịch an toàn cho người dùng.
                      </div>
                    </details>
                  </div>
                </div>

                {/* --- Divider --- */}
                <div className="mx-8 w-[0.6px] bg-slate-300 lg:landscape:h-screen hidden lg:block" />

                {/* --- Cột phải --- */}
                <div className="flex-1 space-y-4">
                  <div className="mb-6">
                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Bạn chấp nhận những phương thức thanh toán nào?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Chúng tôi chấp nhận nhiều phương thức thanh toán, bao gồm ATM tại Việt Nam, Bep20, Trc-20 và các hệ thống thanh toán an toàn khác.
                      </div>
                    </details>

                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Tôi có thể sử dụng phương thức thanh toán nào?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        {ConstantList.APP_NAME} cung cấp nhiều phương thức thanh toán khác nhau để thuận tiện cho bạn. Bạn có thể thanh toán bằng tài khoản ATM Việt Nam (ACB, BIDV), ví điện tử phổ biến hoặc chuyển khoản ngân hàng trực tiếp cho các khu vực được chọn.
                      </div>
                    </details>

                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Tôi phải làm sao nếu không nhận được hàng?
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Nếu có trục trặc và hàng hóa của bạn không đến nơi, hãy liên hệ với chúng tôi ngay lập tức và chúng tôi sẽ giải quyết nhanh nhất có thể.
                      </div>
                    </details>

                    <details open className="group">
                      <summary className="mb-4 list-none font-semibold text-lg text-slate-900 cursor-pointer hover:text-blue-600 transition-colors">
                        Cửa hàng R$ tốt nhất
                      </summary>
                      <div className="text-slate-700 bg-slate-50 p-4 rounded-lg">
                        Với vô số cửa hàng và chủ R$, việc tìm một nơi đáng tin cậy để mua các mặt hàng R$ có thể rất khó khăn. Điều quan trọng là phải chọn một cửa hàng không chỉ cung cấp mức giá tuyệt vời mà còn đảm bảo tính an toàn và tính hợp pháp cho giao dịch mua của bạn.
                        <br />
                        <br />
                        <strong>{ConstantList.APP_NAME}.com</strong> là Cửa hàng R$ tốt nhất. Chúng tôi cung cấp dịch vụ giao hàng ngay lập tức các loại dao R$ với mức giá không thể cạnh tranh hơn, được hỗ trợ bởi dịch vụ trò chuyện trực tiếp 24/7 và đảm bảo hoàn lại tiền nếu các mặt hàng của bạn không được giao.
                        <br />
                        <br />
                        Để có trải nghiệm an toàn và không gặp rắc rối, hãy chọn <strong>{ConstantList.APP_NAME}</strong> làm cửa hàng R$ của bạn!
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
  );
};

export default FrequentlyAskedQuestions;