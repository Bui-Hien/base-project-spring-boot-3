const SystemRole = {
  ROLE_USER:"ROLE_USER",
  ROLE_SELLER:"ROLE_SELLER",
  ROLE_MANAGER:"ROLE_MANAGER",
  ROLE_ADMIN:"ROLE_ADMIN",
};

const AccountStatus = {
  // PENDING:
  //     {
  //       value:0,
  //       name:"Chờ duyệt",
  //       className:"bg-blue-100 text-blue-800 border border-blue-300"
  //     },
  NEW:
      {
        value:1,
        name:"Mới",
        className:"bg-indigo-100 text-indigo-800 border border-indigo-300"
      },
  SOLD:
      {
        value:2,
        name:"Đã bán",
        className:"bg-green-100 text-green-800 border border-green-300"
      },
  ERROR:
      {
        value:3,
        name:"Lỗi",
        className:"bg-yellow-100 text-yellow-800 border border-yellow-300"
      },

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  },
};

const ValueType = {
  STRING:{value:1, name:"Ký tự"},
  INTEGER:{value:2, name:"Số nguyên"},
  DECIMAL:{value:3, name:"Số thập phân"},
  DATE:{value:4, name:"Giờ"},
  BOOLEAN:{value:5, name:"True/false"},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  },
};

const TransactionType = {
  DEPOSIT:{value:1, name:"Nạp tiền"},   // nạp tiền
  WITHDRAW:{value:2, name:"Rút tiền"},  // rút tiền
  REFUND:{value:3, name:"Hoàn tiền"},   // hoàn tiền
  PAYMENT:{value:4, name:"Thanh toán"}, // thanh toán

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  },
};

const TransactionStatus = {
  PENDING:{value:0, name:"Đang xử lý"},
  APPROVED:{value:1, name:"Đã duyệt"},
  REJECTED:{value:2, name:"Từ chối"},
  SUCCESS:{value:3, name:"Thành công"},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  },
};


const VnpRspCode = {
  PENDING:
      {value:"0", name:"Đang xử lý"},
  SUCCESS:
      {value:"00", name:"Giao dịch thành công"},
  FRAUD_SUSPECTED:
      {value:"07", name:"Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)."},
  NOT_REGISTERED_INTERNET_BANKING:
      {
        value:"09",
        name:"Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng."
      },
  AUTHENTICATION_FAILED_3_TIMES:
      {
        value:"10",
        name:"Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần."
      },
  EXPIRED_TRANSACTION:
      {
        value:"11",
        name:"Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch."
      },
  CARD_OR_ACCOUNT_LOCKED:
      {value:"12", name:"Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa."},
  OTP_FAILED:
      {
        value:"13",
        name:"Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch."
      },
  CUSTOMER_CANCELLED:
      {value:"24", name:"Giao dịch không thành công do: Khách hàng hủy giao dịch."},
  INSUFFICIENT_FUNDS:
      {
        value:"51",
        name:"Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch."
      },
  DAILY_LIMIT_EXCEEDED:
      {
        value:"65",
        name:"Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày."
      },
  BANK_MAINTENANCE:
      {value:"75", name:"Ngân hàng thanh toán đang bảo trì."},
  WRONG_PAYMENT_PASSWORD:
      {
        value:"79",
        name:"Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch."
      },
  OTHER_ERROR:
      {value:"99", name:"Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)."},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  },
};


const SystemConfig = {
  ACTIVE_USERS:{
    key:"ACTIVE_USERS",
    type:"BOOLEAN",
    value:true,
    description:"Cấu hình bật tắt người dùng web, nếu bật thì sẽ lấy người dùng thực tế."
  },
  URL_X:{
    key:"URL_X",
    type:"STRING",
    value:"https://x.com/",
    description:"Liên kết đến trang Twitter",
  },

  URL_YOUTUBE:{
    key:"URL_YOUTUBE",
    type:"STRING",
    value:"https://www.youtube.com/",
    description:"Liên kết đến kênh YouTube",
  },

  URL_TIKTOK:{
    key:"URL_TIKTOK",
    type:"STRING",
    value:"https://www.tiktok.com/",
    description:"Liên kết đến trang TikTok",
  },

  URL_DISCORD:{
    key:"URL_DISCORD",
    type:"STRING",
    value:"https://discord.com/",
    description:"Liên kết đến Discord server",
  },

  URL_TELEGRAM:{
    key:"URL_TELEGRAM",
    type:"STRING",
    value:"https://web.telegram.org/",
    description:"Liên kết đến Telegram channel",
  },
  CONTACT_INFO:{
    key:"CONTACT_INFO",
    type:"STRING",
    value:"https://dichvumxh.vn/lien-he",
    description:"Liên hệ - thông tin hoặc trang liên hệ chính thức.",
  },

  ORDER_NOTIFICATION_GROUP:{
    key:"ORDER_NOTIFICATION_GROUP",
    type:"STRING",
    value:"https://t.me/nhomthongbaodon",
    description:"Nhóm thông báo đơn hàng hoặc hệ thống.",
  },

  POLICY_PAGE:{
    key:"POLICY_PAGE",
    type:"STRING",
    value:"https://dichvumxh.vn/chinh-sach-su-dung",
    description:"Chính sách sử dụng dịch vụ.",
  },

  WARRANTY_MODE:{
    key:"WARRANTY_MODE",
    type:"STRING",
    value:"https://dichvumxh.vn/che-do-bao-hanh",
    description:"Chế độ bảo hành dịch vụ.",
  },

  AGENT_REGISTRATION_GUIDE:{
    key:"AGENT_REGISTRATION_GUIDE",
    type:"STRING",
    value:"https://dichvumxh.vn/huong-dan-dang-ky-dai-ly",
    description:"Hướng dẫn đăng ký đại lý.",
  },

  BOT_USAGE_GUIDE:{
    key:"BOT_USAGE_GUIDE",
    type:"STRING",
    value:"https://dichvumxh.vn/cach-su-dung-bot",
    description:"Cách sử dụng bot tự động.",
  },

  REPORT_GUIDE:{
    key:"REPORT_GUIDE",
    type:"STRING",
    value:"https://dichvumxh.vn/huong-dan-report",
    description:"Hướng dẫn Report lỗi hoặc khiếu nại.",
  },

  TWO_FA_GUIDE:{
    key:"TWO_FA_GUIDE",
    type:"STRING",
    value:"https://dichvumxh.vn/huong-dan-dang-nhap-2fa",
    description:"Hướng dẫn đăng nhập bảo mật 2FA.",
  },
  DEFAULT_SELECTED_CATEGORY:{
    key:"DEFAULT_SELECTED_CATEGORY",
    type:"STRING",
    value:"ROBLOX",
    description:"Danh mục tài khoản được chọn mặc định trong màn mua hàng.",
  },

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'key' in this[key])
        .map (key => this[key]);
  }
};

const SystemStatisticsType = {
  REAL_USERS:{code:"REAL_USERS", name:"Số người dùng thực tế"},      // Actual Users
  MARKETING_USERS:{code:"MARKETING_USERS", name:"Số người dùng marketing"}, // Marketing Users
  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'code' in this[key])
        .map (key => this[key]);
  },
};

const PostStatus = {
  DRAFT:{value:0, name:"Nháp"},
  PUBLISHED:{value:1, name:"Đã suất bản"},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  },
};

const ListUserTab = {
  ALL:{value:0, name:"Tất cả"},
  IS_ENABLED:{value:1, name:"Tài khoản bị khóa"},
  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  }
};

const ListSystemStatisticTab = {
  DAILY:{value:0, name:"Thống kê người dùng trong ngày"},
  MONTHLY:{value:1, name:"Thống kê người dùng trong tháng"},
  YEARLY:{value:2, name:"Thống kê người dùng trong năm"},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  }
};
const AccountStatisticsType = {
  DAILY:{value:0, name:"Ngày"},
  MONTHLY:{value:1, name:"Tháng"},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  }
};
const ReportStatus = {
  PENDING:{
    value:0,
    name:"Đang khiếu nại",
    className:"bg-yellow-100 text-yellow-800 border border-yellow-300"
  },
  COMPLETED:{
    value:1,
    name:"Đã hoàn tất",
    className:"bg-green-100 text-green-800 border border-green-300"
  },
  ESCALATED:{
    value:2,
    name:"Khiếu nại lên admin",
    className:"bg-red-100 text-red-800 border border-red-300"
  },

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  }
};

const OrderStatus = {
  SUCCESS:{
    value:0,
    name:"Thành công",
    className:
        "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-100"
  },
  ERROR:{
    value:1,
    name:"Lỗi",
    className:
        "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900 dark:text-red-100"
  },
  REFUNDED:{
    value:2,
    name:"Hoàn tiền cho người mua",
    className:
        "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900 dark:text-amber-100"
  },
  PROCESSING:{
    value:3,
    name:"Đang xử lý",
    className:
        "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900 dark:text-blue-100 animate-pulse"
  },
  REFUNDED_BUYER:{
    value:4,
    name:"Hoàn tiền cho người bán",
    className:
        "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900 dark:text-amber-100"
  },

  getListData () {
    return Object.keys (this)
        .filter (
            key =>
                typeof this[key] === "object" &&
                this[key] !== null &&
                "value" in this[key]
        )
        .map (key => this[key]);
  }
};

const AccountCategoryType = {
  UNIT_PRICE_AND_QUANTITY:{value:0, name:"Có đơn giá và số lượng"},
  TOTAL_AMOUNT_ONLY:{value:1, name:"Chỉ có thành tiền"},

  getListData () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && this[key] !== null && 'value' in this[key])
        .map (key => this[key]);
  }
};

module.exports = Object.freeze ({
  SystemRole:SystemRole,
  AccountStatus:AccountStatus,
  ValueType:ValueType,
  TransactionType:TransactionType,
  VnpRspCode:VnpRspCode,
  TransactionStatus:TransactionStatus,
  SystemConfig:SystemConfig,
  SystemStatisticsType:SystemStatisticsType,
  PostStatus:PostStatus,
  ListUserTab:ListUserTab,
  ListSystemStatisticTab:ListSystemStatisticTab,
  AccountStatisticsType:AccountStatisticsType,
  ReportStatus:ReportStatus,
  OrderStatus:OrderStatus,
  AccountCategoryType:AccountCategoryType
});
