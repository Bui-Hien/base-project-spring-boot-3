const {
  default:LocalStorageService,
} = require ("./service/LocalStorageService");

const APPLICATION_PATH = "/";

module.exports = {
  ROOT_PATH:window?.Configs?.ROOT_PATH || APPLICATION_PATH,
  API_ENDPOINT:window?.Configs?.API_ENDPOINT || "https://hiendev.online",
  LOGIN_PAGE:window?.Configs?.LOGIN_PAGE || APPLICATION_PATH + "login",
  RESET_PASSWORD:window?.Configs?.RESET_PASSWORD || APPLICATION_PATH + "reset-password",
  FORGOT_PASSWORD:window?.Configs?.FORGOT_PASSWORD || APPLICATION_PATH + "forgot-password",
  REGISTER:window?.Configs?.REGISTER || APPLICATION_PATH + "register",
  PROFILE:window?.Configs?.PROFILE || APPLICATION_PATH + "profile",
  HOME_PAGE:window?.Configs?.HOME_PAGE || APPLICATION_PATH + "/home",

  ACTIVE_USERS:LocalStorageService.getConfig ("ACTIVE_USERS") ?? true,
  URL_X:LocalStorageService.getConfig ("URL_X") || "https://x.com/",
  URL_YOUTUBE:LocalStorageService.getConfig ("URL_YOUTUBE") || "https://www.youtube.com/",
  URL_TIKTOK:LocalStorageService.getConfig ("URL_TIKTOK") || "https://www.tiktok.com/",
  URL_DISCORD:LocalStorageService.getConfig ("URL_DISCORD") || "https://discord.com/",
  URL_TELEGRAM:LocalStorageService.getConfig ("URL_TELEGRAM") || "https://web.telegram.org/",
  // ====== Custom Pages / Guides ======
  CONTACT_INFO:LocalStorageService.getConfig ("CONTACT_INFO") || "https://dichvumxh.vn/lien-he",
  ORDER_NOTIFICATION_GROUP:LocalStorageService.getConfig ("ORDER_NOTIFICATION_GROUP") || "https://t.me/nhomthongbaodon",
  POLICY_PAGE:LocalStorageService.getConfig ("POLICY_PAGE") || "https://dichvumxh.vn/chinh-sach-su-dung",
  WARRANTY_MODE:LocalStorageService.getConfig ("WARRANTY_MODE") || "https://dichvumxh.vn/che-do-bao-hanh",
  AGENT_REGISTRATION_GUIDE:LocalStorageService.getConfig ("AGENT_REGISTRATION_GUIDE") || "https://dichvumxh.vn/huong-dan-dang-ky-dai-ly",
  BOT_USAGE_GUIDE:LocalStorageService.getConfig ("BOT_USAGE_GUIDE") || "https://dichvumxh.vn/cach-su-dung-bot",
  REPORT_GUIDE:LocalStorageService.getConfig ("REPORT_GUIDE") || "https://dichvumxh.vn/huong-dan-report",
  TWO_FA_GUIDE:LocalStorageService.getConfig ("TWO_FA_GUIDE") || "https://dichvumxh.vn/huong-dan-dang-nhap-2fa",
  TELEGRAM_BOT_URL:LocalStorageService.getConfig ("TELEGRAM_BOT_URL") || "https://dichvumxh.vn/huong-dan-dang-nhap-2fa",
  APP_NAME:LocalStorageService.getConfig ("APP_NAME") || "Sullrolx",
  DEFAULT_SELECTED_CATEGORY:LocalStorageService.getConfig ("DEFAULT_SELECTED_CATEGORY") || "ROBLOX",
}
