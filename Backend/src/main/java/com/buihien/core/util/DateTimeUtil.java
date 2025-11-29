package com.buihien.core.util;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;

public class DateTimeUtil {

    // Định dạng mặc định: yyyy-MM-dd
    public static String formatDate(LocalDate localDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return localDate.format(formatter);
    }

    // Định dạng ngắn: dd/MM/yyyy
    public static String formatShortDate(LocalDate localDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return localDate.format(formatter);
    }

    // Định dạng ngắn: dd/MM/yyyy HH:mm
    public static String formatShortDateTime(LocalDate localDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return localDate.format(formatter);
    }

    // Định dạng đầy đủ với ngày trong tuần: EEEE, dd MMMM yyyy
    public static String formatFullDate(LocalDate localDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy");
        return localDate.format(formatter);
    }

    // ---------------------- Định dạng cho LocalDateTime ----------------------

    // Định dạng mặc định: yyyy-MM-dd HH:mm:ss
    public static String formatDateTime(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return localDateTime.format(formatter);
    }

    // Định dạng ngắn: dd/MM/yyyy
    public static String formatShortDateTime(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return localDateTime.format(formatter);
    }

    // Định dạng đầy đủ với ngày trong tuần: EEEE, dd MMMM yyyy HH:mm:ss
    public static String formatFullDateTime(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy HH:mm:ss");
        return localDateTime.format(formatter);
    }

    // Định dạng chỉ có giờ phút giây: HH:mm:ss
    public static String formatTimeOnly(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return localDateTime.format(formatter);
    }

    // Định dạng ISO 8601: yyyy-MM-dd'T'HH:mm:ss
    public static String formatISO(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return localDateTime.format(formatter);
    }

    // Lấy thời điểm bắt đầu của ngày (00:00:00)
    public static LocalDateTime getStartOfDay(LocalDateTime date) {
        return date.toLocalDate().atStartOfDay();
    }

    // Lấy thời điểm kết thúc của ngày (23:59:59.999999999)
    public static LocalDateTime getEndOfDay(LocalDateTime date) {
        return date.toLocalDate().atTime(LocalTime.MAX);
    }

    // Lấy năm của một đối tượng LocalDateTime
    public static int getYear(LocalDateTime date) {
        return date.getYear();
    }

    // Lấy tháng của một đối tượng LocalDateTime
    public static int getMonth(LocalDateTime date) {
        return date.getMonthValue();
    }

    // Lấy ngày của một đối tượng LocalDateTime
    public static int getDay(LocalDateTime date) {
        return date.getDayOfMonth();
    }

    // Lấy giờ của một đối tượng LocalDateTime
    public static int getHour(LocalDateTime date) {
        return date.getHour();
    }

    // Lấy phút của một đối tượng LocalDateTime
    public static int getMinute(LocalDateTime date) {
        return date.getMinute();
    }

    // Tính sự chênh lệch số giờ giữa hai mốc thời gian
    public static double hoursDiff(LocalDateTime date1, LocalDateTime date2) {
        return Duration.between(date1, date2).toHours();
    }

    // Lấy ngày đầu tiên của tháng
    public static LocalDate firstDateOfMonth(int month, int year) {
        return LocalDate.of(year, month, 1);
    }

    // Lấy ngày cuối cùng của tháng
    public static LocalDate lastDateOfMonth(int month, int year) {
        return LocalDate.of(year, month, 1).with(TemporalAdjusters.lastDayOfMonth());
    }

    // Lấy số tuần trong tháng
    public static int numberWeekOfMonth(int month, int year) {
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.with(TemporalAdjusters.lastDayOfMonth());
        return YearMonth.of(year, month).lengthOfMonth() / 7 + 1;
    }

    // Lấy số tuần trong năm
    public static int numberWeekOfYear(int year) {
        return Year.of(year).length() / 7;
    }

    // Lấy số ngày của tháng
    public static int numberDayOfMonth(int month, int year) {
        return YearMonth.of(year, month).lengthOfMonth();
    }

    // Lấy ngày đầu tiên của năm
    public static LocalDate firstDateOfYear(int year) {
        return LocalDate.of(year, 1, 1);
    }

    // Lấy ngày cuối cùng của năm
    public static LocalDate lastDateOfYear(int year) {
        return LocalDate.of(year, 12, 31);
    }

    // Kiểm tra xem năm có phải là năm nhuận không
    public static boolean isLeapYear(int year) {
        return Year.isLeap(year);
    }

    // Lấy thứ trong tuần của một ngày cụ thể
    public static DayOfWeek getDayOfWeek(LocalDate date) {
        return date.getDayOfWeek();
    }

    // Lấy múi giờ hiện tại của hệ thống
    public static ZoneId getSystemTimeZone() {
        return ZoneId.systemDefault();
    }

    // Lấy thời gian hiện tại theo múi giờ chỉ định
    public static ZonedDateTime getCurrentTimeInZone(String zoneId) {
        return ZonedDateTime.now(ZoneId.of(zoneId));
    }
}