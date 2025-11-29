import { useTranslation } from "react-i18next";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TikTokIcon from "../ErrorIcon/TikTokIcon";
import DiscordIcon from "../ErrorIcon/DiscordIcon";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import TelegramIcon from '@mui/icons-material/Telegram';
import ConstantList from "../../appConfig";
import { memo } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

const PageFooter = () => {
  const {t} = useTranslation ();
  const {authStore} = useStore ();

  const {currentUser} = authStore;
  return (
      <footer className="w-full bg-white border-t border-slate-200 py-4">
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto px-4">
          {/* --- Left column (logo + info) --- */}
          <div className="col-span-12 xl:col-span-4 space-y-4">
            <div className="">
              <img
                  src="/img/logo.png"
                  alt="Logo"
                  className="object-contain h-[70px] w-auto"/>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ConstantList.APP_NAME} hoạt động độc lập và không liên kết, xác nhận hoặc được tài trợ bởi Uplift Games LLC hoặc Roblox
              Corporation. Chúng tôi là một trang web thị trường độc lập. Tất cả các nhãn hiệu "Adopt Me" vẫn là tài sản
              của Uplift Games LLC.
            </p>
            <p className="text-xs text-slate-600">
              © 2025 {ConstantList.APP_NAME} - Nền tảng giao dịch dành cho game thủ trên toàn thế giới.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4 pt-2">
              {[
                {title:"X", icon:<XIcon fontSize="medium"/>, url:ConstantList.URL_X},
                {title:"YouTube", icon:<YouTubeIcon fontSize="medium"/>, url:ConstantList.URL_YOUTUBE},
                {title:"TikTok", icon:<TikTokIcon fontSize="medium"/>, url:ConstantList.URL_TIKTOK},
                {title:"Discord", icon:<DiscordIcon fontSize="medium"/>, url:ConstantList.URL_DISCORD},
                {title:"Telegram", icon:<TelegramIcon fontSize="medium"/>, url:ConstantList.URL_TELEGRAM},
              ].map ((item, idx) => (
                  <Tooltip key={idx} title={t (item.title)} placement="top">
                    <Link href={item.url} underline="hover">
                  <span className="cursor-pointer text-slate-600 hover:text-blue-500 transition-colors duration-200">
                    {item.icon}
                  </span>
                    </Link>
                  </Tooltip>
              ))}
            </div>
          </div>

          {/* --- Right column (links) --- */}
          <div className="col-span-12 xl:col-span-8 grid grid-cols-12 gap-6">
            <div className={"col-span-12 sm:col-span-6 md:col-span-4"}>
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Hỗ trợ
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                      href={`${ConstantList.TELEGRAM_BOT_URL}${currentUser?.id ? `?start=${currentUser.id}` : ""}`}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Telegram bot {currentUser?.chatId? `(${currentUser?.chatId})` : ""}
                  </Link>
                </li>
                <li>
                  <Link
                      href={ConstantList.CONTACT_INFO}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link
                      href={ConstantList.ORDER_NOTIFICATION_GROUP}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Nhóm thông báo đơn
                  </Link>
                </li>
              </ul>
            </div>

            <div className={"col-span-12 sm:col-span-6 md:col-span-4"}>
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Quy Định Mua Bán
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                      href={ConstantList.POLICY_PAGE}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Chính sách sử dụng
                  </Link>
                </li>
                <li>
                  <Link
                      href={ConstantList.WARRANTY_MODE}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Chế độ bảo hành
                  </Link>
                </li>
                <li>
                  <Link
                      href={ConstantList.AGENT_REGISTRATION_GUIDE}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Hướng dẫn đăng ký đại lý
                  </Link>
                </li>
              </ul>
            </div>

            <div className={"col-span-12 sm:col-span-6 md:col-span-4"}>
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Hướng dẫn
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                      href={ConstantList.BOT_USAGE_GUIDE}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Cách sử dụng bot
                  </Link>
                </li>
                <li>
                  <Link
                      href={ConstantList.REPORT_GUIDE}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Hướng dẫn Report
                  </Link>
                </li>
                <li>
                  <Link
                      href={ConstantList.TWO_FA_GUIDE}
                      underline="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Hướng dẫn đăng nhập 2FA
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default memo (observer (PageFooter));
