package com.buihien.core;

import java.util.ArrayList;
import java.util.List;

public class CoreConstants {
    public static final String ADMIN = "buixuanhien@gmail.com";
    public static final String PASS = "123456";

    public static final String REMOVE_CHANGE_TYPE = "REMOVE";
    public static final String UPDATE_CHANGE_TYPE = "UPDATE";

    //permission
    public static final String ROLE_SYSTEM_ADMIN = "ROLE_SYSTEM_ADMIN";

    public static final String USER_VIEW = createPermission(ControllerEnum.USER, PermissionActionEnum.VIEW);
    public static final String USER_WRITE = createPermission(ControllerEnum.USER, PermissionActionEnum.WRITE);
    public static final String USER_DELETE = createPermission(ControllerEnum.USER, PermissionActionEnum.DELETE);

    public static final String ROLE_VIEW = createPermission(ControllerEnum.ROLE, PermissionActionEnum.VIEW);
    public static final String ROLE_WRITE = createPermission(ControllerEnum.ROLE, PermissionActionEnum.WRITE);
    public static final String ROLE_DELETE = createPermission(ControllerEnum.ROLE, PermissionActionEnum.DELETE);

    public static final String GROUP_VIEW = createPermission(ControllerEnum.GROUP, PermissionActionEnum.VIEW);
    public static final String GROUP_WRITE = createPermission(ControllerEnum.GROUP, PermissionActionEnum.WRITE);
    public static final String GROUP_DELETE = createPermission(ControllerEnum.GROUP, PermissionActionEnum.DELETE);

    public static final String FILE_VIEW = createPermission(ControllerEnum.FILE, PermissionActionEnum.VIEW);
    public static final String FILE_WRITE = createPermission(ControllerEnum.FILE, PermissionActionEnum.WRITE);
    public static final String FILE_DELETE = createPermission(ControllerEnum.FILE, PermissionActionEnum.DELETE);

    public static final String VIDEO_VIEW = createPermission(ControllerEnum.VIDEO, PermissionActionEnum.VIEW);
    public static final String VIDEO_WRITE = createPermission(ControllerEnum.VIDEO, PermissionActionEnum.WRITE);
    public static final String VIDEO_DELETE = createPermission(ControllerEnum.VIDEO, PermissionActionEnum.DELETE);

    public static final String SYSTEM_CONFIG_WRITE = createPermission(ControllerEnum.SYSTEM_CONFIG, PermissionActionEnum.WRITE);
    public static final String SYSTEM_CONFIG_VIEW = createPermission(ControllerEnum.SYSTEM_CONFIG, PermissionActionEnum.VIEW);

    public static final String PERMISSION_VIEW = createPermission(ControllerEnum.PERMISSION, PermissionActionEnum.VIEW);

    public enum ControllerEnum {
        USER("USER"),
        ROLE("ROLE"),
        GROUP("GROUP"),
        FILE("FILE"),
        VIDEO("VIDEO"),
        SYSTEM_CONFIG("SYSTEM_CONFIG"),
        PERMISSION("PERMISSION"),
        ;

        private final String name;

        ControllerEnum(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public enum PermissionActionEnum {
        VIEW("VIEW"),
        WRITE("WRITE"),
        DELETE("DELETE"),
        EXPORT("EXPORT"),
        IMPORT("IMPORT"),
        ;

        private final String action;

        PermissionActionEnum(String action) {
            this.action = action;
        }

        public String getAction() {
            return action;
        }
    }

    public static String createPermission(ControllerEnum entity, PermissionActionEnum action) {
        return entity.getName().toUpperCase() + "_" + action.getAction().toUpperCase();
    }

    public static List<String> getListPermissions() {
        List<String> result = new ArrayList<>();
        result.addAll(List.of(USER_VIEW, USER_WRITE, USER_DELETE));
        result.addAll(List.of(ROLE_VIEW, ROLE_WRITE, ROLE_DELETE));
        result.addAll(List.of(GROUP_VIEW, GROUP_WRITE, GROUP_DELETE));
        result.addAll(List.of(FILE_VIEW, FILE_WRITE, FILE_DELETE));
        result.addAll(List.of(VIDEO_VIEW, VIDEO_WRITE, VIDEO_DELETE));
        result.addAll(List.of(SYSTEM_CONFIG_VIEW, SYSTEM_CONFIG_WRITE));
        result.addAll(List.of(PERMISSION_VIEW));

        return result;
    }

    public enum TokenType {
        ACCESS_TOKEN(1, "Access TokenCache"),
        REFRESH_TOKEN(2, "Refresh TokenCache"),
        RESET_TOKEN(3, "Reset TokenCache"),
        ACTIVE_USER_TOKEN(4, "Reset TokenCache"),
        ;
        private final Integer value;
        private final String name;

        TokenType(Integer value, String name) {
            this.value = value;
            this.name = name;
        }

        public Integer getValue() {
            return value;
        }

        public String getName() {
            return name;
        }

        public static String getNameByValue(Integer value) {
            if (value == null) return null;
            for (TokenType item : TokenType.values()) {
                if (item.getValue().equals(value)) {
                    return item.getName();
                }
            }
            return null;
        }
    }

    public enum ValueType {
        STRING(1, "STRING"),
        INTEGER(2, "INTEGER"),
        DECIMAL(3, "DECIMAL"),
        DATE(4, "DATE"),
        BOOLEAN(5, "BOOLEAN");

        private final Integer value;
        private final String name;

        ValueType(Integer value, String name) {
            this.value = value;
            this.name = name;
        }

        public Integer getValue() {
            return value;
        }

        public String getName() {
            return name;
        }

        public static String getNameByValue(Integer value) {
            if (value == null) return null;
            for (ValueType type : ValueType.values()) {
                if (type.getValue().equals(value)) {
                    return type.getName();
                }
            }
            return null;
        }
    }

    public enum VnpRspCode {
        SUCCESS("00", "Giao dịch thành công"),
        FRAUD_SUSPECTED("07", "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)."),
        NOT_REGISTERED_INTERNET_BANKING("09", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng."),
        AUTHENTICATION_FAILED_3_TIMES("10", "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần."),
        EXPIRED_TRANSACTION("11", "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch."),
        CARD_OR_ACCOUNT_LOCKED("12", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa."),
        OTP_FAILED("13", "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch."),
        CUSTOMER_CANCELLED("24", "Giao dịch không thành công do: Khách hàng hủy giao dịch."),
        INSUFFICIENT_FUNDS("51", "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch."),
        DAILY_LIMIT_EXCEEDED("65", "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày."),
        BANK_MAINTENANCE("75", "Ngân hàng thanh toán đang bảo trì."),
        WRONG_PAYMENT_PASSWORD("79", "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch."),
        OTHER_ERROR("99", "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê).");


        private final String value;
        private final String description;

        VnpRspCode(String value, String description) {
            this.value = value;
            this.description = description;
        }

        public String getValue() {
            return value;
        }

        public String getDescription() {
            return description;
        }

        public static String getDescriptionByValue(String value) {
            if (value == null) return null;
            for (VnpRspCode code : VnpRspCode.values()) {
                if (code.getValue().equals(value)) {
                    return code.getDescription();
                }
            }
            return null;
        }
    }

    public enum SystemConfig {
        ACTIVE_USERS("ACTIVE_USERS", ValueType.BOOLEAN.getValue(), String.valueOf(Boolean.TRUE), "Cấu hình bật tắt người dùng web, nếu bật thì sẽ lấy người dùng thực tế."),
        URL_X("URL_X", ValueType.STRING.getValue(), "https://x.com/", "Liên kết đến trang Twitter"),
        URL_YOUTUBE("URL_YOUTUBE", ValueType.STRING.getValue(), "https://www.youtube.com/", "Liên kết đến kênh YouTube"),
        URL_TIKTOK("URL_TIKTOK", ValueType.STRING.getValue(), "https://www.tiktok.com/", "Liên kết đến trang TikTok"),
        URL_DISCORD("URL_DISCORD", ValueType.STRING.getValue(), "https://discord.com/", "Liên kết đến Discord server"),
        URL_TELEGRAM("URL_TELEGRAM", ValueType.STRING.getValue(), "https://web.telegram.org/", "Liên kết đến Telegram channel"),

        POLICY_PAGE("POLICY_PAGE", ValueType.STRING.getValue(), "https://dichvumxh.vn/chinh-sach-su-dung", "Chính sách sử dụng dịch vụ."),
        CONTACT_INFO("CONTACT_INFO", ValueType.STRING.getValue(), "https://dichvumxh.vn/lien-he", "Liên hệ - thông tin hoặc trang liên hệ chính thức."),
        ORDER_NOTIFICATION_GROUP("ORDER_NOTIFICATION_GROUP", ValueType.STRING.getValue(), "https://t.me/nhomthongbaodon", "Nhóm thông báo đơn hàng hoặc hệ thống."),
        WARRANTY_MODE("WARRANTY_MODE", ValueType.STRING.getValue(), "https://dichvumxh.vn/che-do-bao-hanh", "Chế độ bảo hành dịch vụ."),
        AGENT_REGISTRATION_GUIDE("AGENT_REGISTRATION_GUIDE", ValueType.STRING.getValue(), "https://dichvumxh.vn/huong-dan-dang-ky-dai-ly", "Hướng dẫn đăng ký đại lý."),
        BOT_USAGE_GUIDE("BOT_USAGE_GUIDE", ValueType.STRING.getValue(), "https://dichvumxh.vn/cach-su-dung-bot", "Cách sử dụng bot tự động."),
        REPORT_GUIDE("REPORT_GUIDE", ValueType.STRING.getValue(), "https://dichvumxh.vn/huong-dan-report", "Hướng dẫn Report lỗi hoặc khiếu nại."),
        TWO_FA_GUIDE("TWO_FA_GUIDE", ValueType.STRING.getValue(), "https://dichvumxh.vn/huong-dan-dang-nhap-2fa", "Hướng dẫn đăng nhập bảo mật 2FA."),
        APP_NAME("APP_NAME", ValueType.STRING.getValue(), "Sullrolx.com", "Tên trang web."),
        VIET_QR_URL("VIET_QR_URL", ValueType.STRING.getValue(), "https://api.vietqr.io/image/970415-100875083921-Qq7r6OI.jpg", "url thông tin nạp tiền."),
        ACCOUNT_BANK_NAME("ACCOUNT_BANK_NAME", ValueType.STRING.getValue(), "BUI XUAN HIEN", "Tên chủ tài khoản."),
        TELEGRAM_BOT_URL("TELEGRAM_BOT_URL", ValueType.STRING.getValue(), "https://t.me/hien_dev_test_bot", "Truy cập bot thông báo telegram."),
        DEFAULT_SELECTED_CATEGORY("DEFAULT_SELECTED_CATEGORY", ValueType.STRING.getValue(), "ROBLOX", "Danh mục tài khoản được chọn mặc định trong màn mua hàng."),
        ;

        private String key;  // tên cấu hình
        private Integer type; // ValueType
        private String value; // giá trị
        private String description; // mô tả cấu hình

        SystemConfig(String key, Integer type, String value, String description) {
            this.key = key;
            this.type = type;
            this.value = value;
            this.description = description;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public Integer getType() {
            return type;
        }

        public void setType(Integer type) {
            this.type = type;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

}
