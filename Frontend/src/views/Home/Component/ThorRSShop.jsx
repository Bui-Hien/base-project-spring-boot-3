import React, { memo, useEffect, useRef, useState } from 'react';
import { ShoppingCart, Users, Users2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const ThorRSShop = () => {
  const {systemStatisticStore} = useStore();
  const {systemStatisticsUser} = systemStatisticStore;
  const navigate = useNavigate();

  const swiperRef = useRef(null);

  const buyerNames = [
    'ProGamer2k3', 'DarkKnight99', 'ShadowHunter', 'VietnameseGirl', 'NoobMaster69',
    'ChuongGapMeVN', 'TopOneSaiGon', 'SatThuHaNoi', 'ThienThanHCM', 'MeoConDaNang',
    'DaiGiaMyDinh', 'TayChoi247', 'LinhMieuVN', 'ProPlayerHN', 'XeMayDiemHen',
    'xXDarkLordXx', 'NightWolf88', 'SilentKiller', 'CuteBaby99', 'DevilMayCry',
    'VIPGamer2024', 'TigerWarrior', 'PhoenixRising', 'GhostRider', 'AngelWings',
    'RankThachDau', 'TopLaneGod', 'MidLaner99', 'ADCCarry', 'SupportMain'
  ];

  const timeTexts = [
    '1 phút trước', '2 phút trước', '3 phút trước', '5 phút trước',
    '6 phút trước', '7 phút trước', '8 phút trước', '10 phút trước',
    '15 phút trước', '20 phút trước', '25 phút trước', '30 phút trước',
    '35 phút trước', '40 phút trước', '45 phút trước'
  ];

  const [recentBuyers, setRecentBuyers] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const shuffledNames = shuffleArray(buyerNames);
    const shuffledTimes = shuffleArray(timeTexts);

    const buyers = shuffledNames.slice(0, 10).map((name, index) => ({
      id: index + 1,
      name: name,
      vip: Math.floor(Math.random() * 4),
      time: shuffledTimes[index]
    }));

    buyers.sort((a, b) => {
      const getMinutes = (time) => parseInt(time.match(/\d+/)[0]);
      return getMinutes(a.time) - getMinutes(b.time);
    });

    setRecentBuyers(buyers);
  }, []);

  return (
      <div
          className="relative overflow-hidden pt-16 pb-24"
          style={{
            backgroundImage: "url('/img/banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-orange-400 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-sm">
            🚀 Tốc độ và Bảo mật
          </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Shop mua bán{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              R$
            </span>{' '}
              ngay lập tức
            </h1>

            <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-lg">
              Cửa hàng nhanh nhất, rẻ nhất và an toàn nhất. Giao hàng tự động trong vài phút!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                  onClick={() => navigate(`/account-shop`)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/50"
              >
                <ShoppingCart size={20} />
                <span>Mua Ngay</span>
              </button>
              <button
                  onClick={() => navigate(`/instruct`)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20"
              >
                <span>Xem Hướng Dẫn</span>
              </button>
            </div>
          </div>

          {/* Recent Buyers Slider */}
          <div className="mt-20">
            <h2 className="text-center text-sm font-semibold text-gray-300 uppercase tracking-wide mb-8">
              Mua hàng gần đây
            </h2>
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                breakpoints={{
                  320: {slidesPerView: 1},
                  640: {slidesPerView: 2},
                  1024: {slidesPerView: 4},
                }}
                navigation
                pagination={{clickable: true}}
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                speed={800}
                loop={true}
                className="pb-16"
            >
              {recentBuyers.map((buyer) => (
                  <SwiperSlide key={buyer.id}>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all h-full">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold mb-3 shadow-lg">
                        VIP {buyer.vip}
                      </div>
                      <p className="text-center text-sm text-white font-medium">{buyer.name}</p>
                      <p className="text-center text-xs text-gray-300 mt-2">{buyer.time}</p>
                      <p className="text-center text-xs text-green-400 mt-3 font-medium">✓ Thành công</p>
                    </div>
                  </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-20">
            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20 backdrop-blur-sm">
                  <Users size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Trực tuyến</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {systemStatisticsUser?.totalOnlineUsers || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20 backdrop-blur-sm">
                  <Users2 size={24} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Tổng người dùng</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {systemStatisticsUser?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-8 text-center">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-2xl sm:text-3xl font-bold text-white">⚡ Nhanh</p>
              <p className="text-sm text-gray-300 mt-1">Giao trong phút</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-2xl sm:text-3xl font-bold text-white">🔒 An toàn</p>
              <p className="text-sm text-gray-300 mt-1">Bảo vệ tài khoản</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-2xl sm:text-3xl font-bold text-white">💰 Rẻ</p>
              <p className="text-sm text-gray-300 mt-1">Giá tốt nhất</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default memo(observer(ThorRSShop));