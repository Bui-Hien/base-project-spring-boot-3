package com.buihien.core.util;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class KeywordFilterUtil {
    private static final List<String> BANNED_KEYWORDS = List.of(
            // Tục tĩu – chửi bậy
            "địt", "lồn", "cặc", "buồi", "buồi", "chim", "bím", "l`", "đụ", "nứng", "dâm", "chịch",
            "mẹ mày", "bố mày", "ông mày", "bà mày", "con mẹ", "con cha", "thằng cha",
            "thằng ngu", "con ngu", "óc chó", "chó má", "chó đẻ", "mất dạy", "láo toét", "láo chó",
            "đĩ", "con đĩ", "gái đĩ", "con phò", "con cave", "phò", "cave", "gái ngành",
            "đồ rẻ rách", "vô học", "mặt l*n", "mặt chó",

            // Tiếng lóng tục / viết tắt tục
            "dm", "đm", "dmm", "dkm", "cl", "vl", "vkl", "ml", "cc", "bố láo", "sml",

            // Tiếng Anh bậy
            "fuck", "shit", "bitch", "asshole", "dick", "pussy", "motherfucker", "slut", "whore"
    );

    // Regex phát hiện số điện thoại Việt Nam (9-11 số, có thể có +84 hoặc 0)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?:\\+?84|0)\\d{8,10}"
    );

    // Regex phát hiện email
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
    );

    // Regex phát hiện số CMND/CCCD (9 hoặc 12 số)
    private static final Pattern ID_PATTERN = Pattern.compile(
            "\\b\\d{9}(\\d{3})?\\b"
    );

    // Map đổi chữ số tiếng Việt -> số
    private static final Map<String, String> VIET_DIGITS = Map.ofEntries(
            Map.entry("không", "0"), Map.entry("0", "0"),
            Map.entry("một", "1"),   Map.entry("1", "1"),
            Map.entry("hai", "2"),   Map.entry("2", "2"),
            Map.entry("ba", "3"),    Map.entry("3", "3"),
            Map.entry("bốn", "4"),   Map.entry("tư", "4"), Map.entry("4", "4"),
            Map.entry("năm", "5"),   Map.entry("lăm", "5"), Map.entry("5", "5"),
            Map.entry("sáu", "6"),   Map.entry("6", "6"),
            Map.entry("bảy", "7"),   Map.entry("7", "7"),
            Map.entry("tám", "8"),   Map.entry("8", "8"),
            Map.entry("chín", "9"),  Map.entry("9", "9")
    );

    // Hàm chuẩn hóa: chuyển văn bản chứa chữ số tiếng Việt về dạng số
    private static String normalizeDigits(String input) {
        StringBuilder sb = new StringBuilder();
        String[] tokens = input.toLowerCase().split("\\s+");
        for (String token : tokens) {
            if (VIET_DIGITS.containsKey(token)) {
                sb.append(VIET_DIGITS.get(token));
            } else if (token.matches("\\d+")) {
                sb.append(token);
            }
        }
        return sb.toString();
    }

    /**
     * Kiểm tra chuỗi có hợp lệ không (không chứa từ cấm, không lộ thông tin cá nhân)
     * @param input Chuỗi cần kiểm tra
     * @return true nếu hợp lệ, false nếu vi phạm
     */
    public static boolean isValid(String input) {
        if (input == null || input.isEmpty()) {
            return true; // rỗng coi như hợp lệ
        }

        String lower = input.toLowerCase();

        // Kiểm tra từ khóa cấm
        for (String keyword : BANNED_KEYWORDS) {
            if (lower.contains(keyword)) {
                return false;
            }
        }

        // Kiểm tra email
        if (EMAIL_PATTERN.matcher(input).find()) {
            return false;
        }

        // Kiểm tra số điện thoại trực tiếp
        if (PHONE_PATTERN.matcher(input).find()) {
            return false;
        }

        // Chuẩn hóa chuỗi số (chữ số VN -> số) và kiểm tra lại
        String normalized = normalizeDigits(input);
        if (normalized.length() >= 9) { // nếu sau chuẩn hóa có thể thành số dài
            if (PHONE_PATTERN.matcher(normalized).find()) {
                return false;
            }
            if (ID_PATTERN.matcher(normalized).find()) {
                return false;
            }
        }

        return true;
    }
}
