package com.buihien.core.util;

import com.buihien.core.dto.AuditableDto;
import com.buihien.core.generic.PagedDataFetcher;
import com.buihien.core.util.anotation.Excel;
import com.buihien.core.util.anotation.ExcelColumnGetter;
import com.buihien.core.util.anotation.ExcelColumnSetter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Component
public class ExcelUtil {
    private static final Logger log = LoggerFactory.getLogger(ExcelUtil.class);

    public static <DTO extends AuditableDto> ByteArrayResource writeExcelStreaming(
            PagedDataFetcher<DTO> dataSupplier,
            Class<? extends AuditableDto> clazz,
            long totalElements,
            int pageSize) throws Exception {

        try (Workbook workbook = new SXSSFWorkbook(100); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            // Lấy font mặc định
            Font defaultFont = workbook.createFont();
            defaultFont.setFontHeightInPoints((short) 12);

            // Font đậm
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldFont.setFontHeightInPoints((short) 12);

            Excel excelAnnotation = clazz.getAnnotation(Excel.class);
            String sheetName = (excelAnnotation != null && StringUtils.hasText(excelAnnotation.name().strip()))
                    ? excelAnnotation.name() : "Sheet 1";
            int startRow = (excelAnnotation != null && excelAnnotation.startRow() >= 0)
                    ? excelAnnotation.startRow() : 0;
            boolean numericalOrder = excelAnnotation != null && excelAnnotation.numericalOrder();
            String numericalOrderName = excelAnnotation != null && excelAnnotation.numericalOrderName() != null
                    ? excelAnnotation.numericalOrderName() : "";

            Sheet sheet = workbook.createSheet(sheetName);

            // Đọc thông tin màu từ annotation
            short backgroundColor = (excelAnnotation != null && excelAnnotation.backgroundColor() >= 0 && excelAnnotation.backgroundColor() <= 64)
                    ? excelAnnotation.backgroundColor() : IndexedColors.WHITE.getIndex();
            short textColor = (excelAnnotation != null && excelAnnotation.textColor() >= 0 && excelAnnotation.textColor() <= 64)
                    ? excelAnnotation.textColor() : IndexedColors.BLACK.getIndex();
            short headerBackgroundColor = (excelAnnotation != null && excelAnnotation.headerBackgroundColor() >= 0 && excelAnnotation.headerBackgroundColor() <= 64)
                    ? excelAnnotation.headerBackgroundColor() : IndexedColors.LIGHT_BLUE.getIndex();
            short headerTextColor = (excelAnnotation != null && excelAnnotation.headerTextColor() >= 0 && excelAnnotation.headerTextColor() <= 64)
                    ? excelAnnotation.headerTextColor() : IndexedColors.WHITE.getIndex();

            // Tạo style
            CellStyle boldCenterStyle = createCellStyle(workbook, boldFont, HorizontalAlignment.CENTER, headerBackgroundColor, headerTextColor);
            CellStyle normalCenterStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.CENTER, backgroundColor, textColor);
            CellStyle normalLeftStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.LEFT, backgroundColor, textColor);
            CellStyle normalRightStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.RIGHT, backgroundColor, textColor);

            // Cache các phương thức ExcelColumn
            Map<Integer, Method> columnMethods = new TreeMap<>(); // TreeMap để đảm bảo thứ tự
            for (Method method : clazz.getDeclaredMethods()) {
                if (method.isAnnotationPresent(ExcelColumnGetter.class)) {
                    ExcelColumnGetter column = method.getAnnotation(ExcelColumnGetter.class);
                    int columnIndex = column.index();
                    columnMethods.put(columnIndex, method);
                    method.setAccessible(true);
                }
            }

            // Tạo hàng tiêu đề
            Row row = sheet.createRow(startRow);
            Cell cell;

            if (numericalOrder) {
                cell = row.createCell(0);
                cell.setCellValue(numericalOrderName);
                cell.setCellStyle(boldCenterStyle);
            }

            for (Map.Entry<Integer, Method> entry : columnMethods.entrySet()) {
                int columnIndex = entry.getKey();
                if (numericalOrder) {
                    columnIndex += 1;
                }
                Method method = entry.getValue();
                ExcelColumnGetter column = method.getAnnotation(ExcelColumnGetter.class);

                cell = row.createCell(columnIndex);
                cell.setCellValue(column.title());
                cell.setCellStyle(boldCenterStyle);

                // Set column width
                if (column.width() != -1 && column.width() > 0) {
                    try {
                        sheet.setColumnWidth(columnIndex, (column.width() + 5) * 256);
                    } catch (Exception e) {
                        log.error("Lỗi khi thiết lập độ rộng cột: " + e.getMessage());
                        sheet.setColumnWidth(columnIndex, 15 * 256);
                    }
                } else {
                    try {
                        String title = column.title();
                        if (StringUtils.hasText(title)) {
                            sheet.setColumnWidth(columnIndex, (title.length() + 5) * 256);
                        } else {
                            sheet.setColumnWidth(columnIndex, 15 * 256);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi thiết lập độ rộng cột: " + e.getMessage());
                        sheet.setColumnWidth(columnIndex, 15 * 256);
                    }
                }
            }

            // Ghi dữ liệu theo từng trang
            int totalPages = (int) Math.ceil((double) totalElements / pageSize);
            int rowNum = startRow + 1;
            int globalIndex = 1;

            for (int pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
                log.info("Đang ghi trang {}/{} vào Excel...", pageIndex, totalPages);

                // Lấy dữ liệu trang hiện tại
                List<DTO> pageData = dataSupplier.getPage(pageIndex, pageSize);

                if (pageData == null || pageData.isEmpty()) {
                    log.warn("Không có dữ liệu ở trang {}, dừng ghi", pageIndex);
                    break;
                }

                // Ghi từng row của trang hiện tại
                for (DTO obj : pageData) {
                    row = sheet.createRow(rowNum++);

                    if (numericalOrder) {
                        cell = row.createCell(0);
                        cell.setCellValue(globalIndex++);
                        cell.setCellStyle(normalCenterStyle);
                    }

                    for (Map.Entry<Integer, Method> entry : columnMethods.entrySet()) {
                        int columnIndex = entry.getKey();
                        Method method = entry.getValue();
                        if (numericalOrder) {
                            columnIndex += 1;
                        }

                        cell = row.createCell(columnIndex);
                        try {
                            Object value = method.invoke(obj);
                            if (value != null) {
                                setCellValue(cell, value, method.getReturnType());
                            }
                            if (method.getReturnType() == String.class ||
                                    method.getReturnType() == Date.class ||
                                    method.getReturnType() == LocalDate.class ||
                                    method.getReturnType() == LocalDateTime.class) {
                                cell.setCellStyle(normalLeftStyle);
                            } else if (method.getReturnType() == Boolean.class ||
                                    method.getReturnType() == boolean.class) {
                                cell.setCellStyle(normalCenterStyle);
                            } else {
                                cell.setCellStyle(normalRightStyle);
                            }

                        } catch (Exception e) {
                            log.error("Lỗi khi lấy giá trị từ method {}: {}", method.getName(), e.getMessage(), e);
                        }
                    }
                }

                log.info("Đã ghi {} bản ghi từ trang {}", pageData.size(), pageIndex);
            }

            log.info("Hoàn thành ghi Excel với {} dòng dữ liệu", rowNum - startRow - 1);

            workbook.write(out);
            byte[] bytes = out.toByteArray();

            if (bytes.length == 0) {
                log.error("Export Excel thất bại - file rỗng");
                throw new Exception("File Excel trống, không có dữ liệu để xuất");
            }

            return new ByteArrayResource(bytes);

        } catch (Exception e) {
            log.error("Lỗi khi tạo file Excel: {}", e.getMessage(), e);
            throw new Exception("Không thể tạo file Excel");
        }
    }

    public static <DTO> List<DTO> readExcelBatch(
            InputStream fileInputStream,
            Class<DTO> clazz,
            int startRowIndex,
            int limit
    ) {
        List<DTO> dataList = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(fileInputStream)) {

            // Lấy annotation @Excel
            Excel excelAnnotation = clazz.getAnnotation(Excel.class);
            Sheet sheet = workbook.getSheetAt((excelAnnotation != null) ? excelAnnotation.index() : 0);
            boolean numericalOrder = excelAnnotation != null && excelAnnotation.numericalOrder();

            // Lấy danh sách setter có @ExcelColumnSetter
            Method[] methods = clazz.getDeclaredMethods();
            Map<Integer, Method> columnSetters = new HashMap<>();

            for (Method method : methods) {
                if (method.isAnnotationPresent(ExcelColumnSetter.class)) {
                    ExcelColumnSetter column = method.getAnnotation(ExcelColumnSetter.class);
                    columnSetters.put(column.index(), method);
                    method.setAccessible(true);
                }
            }

            int lastRowNum = sheet.getLastRowNum();
            int endRowIndex = Math.min(startRowIndex + limit - 1, lastRowNum);

            if (startRowIndex > lastRowNum) {
                log.info("Đã đọc hết dữ liệu Excel (startRowIndex={} > lastRowNum={})", startRowIndex, lastRowNum);
                return Collections.emptyList();
            }

            for (int rowIndex = startRowIndex; rowIndex <= endRowIndex; rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) continue;

                try {
                    DTO obj = clazz.getDeclaredConstructor().newInstance();

                    for (Map.Entry<Integer, Method> entry : columnSetters.entrySet()) {
                        int columnIndex = entry.getKey();
                        if (numericalOrder) columnIndex += 1;

                        Method setter = entry.getValue();
                        Cell cell = row.getCell(columnIndex);
                        if (cell != null) {
                            Class<?> paramType = setter.getParameterTypes()[0];
                            setter.invoke(obj, getCellValue(cell, paramType));
                        }
                    }

                    dataList.add(obj);
                } catch (Exception e) {
                    log.error("Lỗi khi tạo đối tượng từ dòng {}: {}", rowIndex, e.getMessage(), e);
                }
            }

        } catch (Exception e) {
            log.error("Lỗi khi đọc file Excel: {}", e.getMessage(), e);
        }
        return dataList;
    }

    private static void copyCellValue(Cell sourceCell, Cell targetCell) {
        switch (sourceCell.getCellType()) {
            case STRING:
                targetCell.setCellValue(sourceCell.getStringCellValue());
                break;
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(sourceCell)) {
                    targetCell.setCellValue(sourceCell.getDateCellValue());
                } else {
                    targetCell.setCellValue(sourceCell.getNumericCellValue());
                }
                break;
            case BOOLEAN:
                targetCell.setCellValue(sourceCell.getBooleanCellValue());
                break;
            case FORMULA:
                targetCell.setCellFormula(sourceCell.getCellFormula());
                break;
            case BLANK:
            case _NONE:
            case ERROR:
            default:
                break;
        }
    }

    private static void setCellValue(Cell cell, Object value, Class<?> returnType) {
        try {
            if (returnType == int.class || returnType == Integer.class) {
                cell.setCellValue((Integer) value);
            } else if (returnType == double.class || returnType == Double.class) {
                cell.setCellValue((Double) value);
            } else if (returnType == long.class || returnType == Long.class) {
                cell.setCellValue((Long) value);
            } else if (returnType == boolean.class || returnType == Boolean.class) {
                cell.setCellValue((Boolean) value);
            } else if (returnType == LocalDate.class) {
                cell.setCellValue(DateTimeUtil.formatShortDate((LocalDate) value)); // Hoặc format ngày theo yêu cầu
            } else if (returnType == LocalDateTime.class) {
                cell.setCellValue(DateTimeUtil.formatShortDateTime((LocalDateTime) value)); // Hoặc format ngày theo yêu cầu
            } else {
                cell.setCellValue(value.toString());
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            cell.setCellValue(value.toString());
        }
    }

    public static Object getCellValue(Cell cell, Class<?> type) {
        if (cell == null) return getDefaultValue(type);

        Object value;
        try {
            switch (cell.getCellType()) {
                case STRING:
                    value = cell.getStringCellValue();
                    if (type == LocalDate.class) {
                        return handleDateString(cell.getStringCellValue(), type);
                    }
                    if (type == LocalDateTime.class) {
                        return handleDateString(cell.getStringCellValue(), type);
                    }
                    break;
                case NUMERIC:
                    if (DateUtil.isCellDateFormatted(cell)) { // Kiểm tra Date
                        Date date = cell.getDateCellValue();
                        if (type == LocalDate.class)
                            return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                        if (type == LocalDateTime.class)
                            return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                        return date;
                    }
                    if (type == LocalDate.class) {
                        return handleDateString(String.valueOf(cell.getNumericCellValue()), type);
                    }
                    if (type == LocalDateTime.class) {
                        return handleDateString(String.valueOf(cell.getNumericCellValue()), type);
                    }
                    value = cell.getNumericCellValue();
                    break;
                case BOOLEAN:
                    value = cell.getBooleanCellValue();
                    break;
                case FORMULA:
                    try {
                        value = cell.getNumericCellValue();
                    } catch (IllegalStateException e) {
                        value = cell.getStringCellValue();
                    }
                    break;
                case ERROR:
                    value = "ERROR_" + cell.getErrorCellValue();
                    break;
                case BLANK:
                default:
                    return getDefaultValue(type);
            }
            return castToType(value, type);
        } catch (Exception e) {
            log.error("Lỗi khi xử lý ô Excel: {}", type.getSimpleName());
            return getDefaultValue(type); // Trả về giá trị mặc định khi lỗi
        }
    }

    private static Object castToType(Object value, Class<?> type) {
        if (value == null || !StringUtils.hasText(value.toString())) return getDefaultValue(type);

        try {
            if (type == String.class) return value.toString();
            if (type == Integer.class || type == int.class) return (int) Double.parseDouble(value.toString());
            if (type == Long.class || type == long.class)
                return (long) Double.parseDouble(value.toString()); // Fix lỗi ép kiểu
            if (type == Double.class || type == double.class) return Double.parseDouble(value.toString());
            if (type == Float.class || type == float.class) return Float.parseFloat(value.toString());
            if (type == Short.class || type == short.class) return (short) Double.parseDouble(value.toString());
            if (type == Byte.class || type == byte.class) return (byte) Double.parseDouble(value.toString());
            if (type == BigDecimal.class) return new BigDecimal(value.toString());
            if (type == Boolean.class || type == boolean.class) return Boolean.parseBoolean(value.toString());
            return value;
        } catch (Exception e) {
            log.error("Lỗi ép kiểu: {} -> {}", value, type.getSimpleName());
            return getDefaultValue(type);
        }
    }

    private static Object handleDateString(String value, Class<?> type) {
        if (value == null || !StringUtils.hasText(value.toString())) return getDefaultValue(type);
        try {
            String strValue = value.toString().trim();

            // Kiểm tra nếu là số (dữ liệu từ Excel có thể bị chuyển thành số thực)
            if (strValue.matches("\\d+\\.\\d+")) {
                strValue = strValue.split("\\.")[0]; // Lấy phần nguyên nếu là số thực (e.g., "2000.0" -> "2000")
            }
            if (type == LocalDate.class || type == LocalDateTime.class) {
                String[] parts = strValue.split("/");
                int day = 1, month = 1, year = 1000;

                if (parts.length == 1) { // Chỉ có năm
                    year = Integer.parseInt(parts[0]);
                } else if (parts.length == 2) { // Chỉ có tháng và năm
                    month = Integer.parseInt(parts[0]);
                    year = Integer.parseInt(parts[1]);
                } else if (parts.length == 3) { // Đủ ngày/tháng/năm
                    day = Integer.parseInt(parts[0]);
                    month = Integer.parseInt(parts[1]);
                    year = Integer.parseInt(parts[2]);
                }
                LocalDate date = LocalDate.of(year, month, day);
                return type == LocalDate.class ? date : date.atStartOfDay();
            }
        } catch (Exception e) {
            log.error("Lỗi khi xử lý chuỗi ngày tháng: {}", value);
        }
        return value;
    }

    private static Object getDefaultValue(Class<?> type) {
        if (type == int.class) return 0;
        if (type == double.class) return 0.0;
        if (type == float.class) return 0.0f;
        if (type == long.class) return 0L;
        if (type == short.class) return (short) 0;
        if (type == byte.class) return (byte) 0;
        if (type == boolean.class) return false;
        return null; // Các kiểu Object mặc định là null
    }

    // Hàm tạo style
    private static CellStyle createCellStyle(Workbook workbook, Font font, HorizontalAlignment alignment, Short backgroundColor, Short textColor) {
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        style.setAlignment(alignment);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        if (backgroundColor != null) {
            style.setFillForegroundColor(backgroundColor);
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        }

        if (textColor != null) {
            Font newFont = workbook.createFont();
            newFont.setColor(textColor);
            newFont.setBold(font.getBold());
            newFont.setFontHeightInPoints(font.getFontHeightInPoints());
            style.setFont(newFont);
        }

        return style;
    }

    public static String sanitizeFileName(String name) {
        if (!StringUtils.hasText(name)) {
            return "Exported_File";
        }
        // Loại bỏ ký tự đặc biệt, chỉ giữ lại chữ, số, gạch ngang (-), gạch dưới (_)
        String sanitized = name.replaceAll("[^a-zA-Z0-9-_]", "_");
        return sanitized.length() > 255 ? sanitized.substring(0, 255) : sanitized;
    }
//
//
//    public static <DTO extends AuditableDto> ByteArrayResource writeExcel(List<DTO> dataList, Class<? extends AuditableDto> clazz) {
//        try (Workbook workbook = new SXSSFWorkbook(100); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
//            // Lấy font mặc định
//            Font defaultFont = workbook.createFont();
//            defaultFont.setFontHeightInPoints((short) 12); // Kích thước chữ mặc định
//
//            // Font đậm
//            Font boldFont = workbook.createFont();
//            boldFont.setBold(true);
//            boldFont.setFontHeightInPoints((short) 12); // Kích thước chữ
//
//            Row row = null;
//            Cell cell = null;
//            Excel excelAnnotation = clazz.getAnnotation(Excel.class);
//            String sheetName = (excelAnnotation != null && StringUtils.hasText(excelAnnotation.name().strip())) ? excelAnnotation.name() : "Sheet 1";
//            int startRow = (excelAnnotation != null && excelAnnotation.startRow() >= 0) ? excelAnnotation.startRow() : 0;
//            boolean numericalOrder = excelAnnotation != null && excelAnnotation.numericalOrder();
//            String numericalOrderName = excelAnnotation != null && excelAnnotation.numericalOrderName() != null ? excelAnnotation.numericalOrderName() : "";
//
//            Sheet sheet = workbook.createSheet(sheetName);
//
//            // Đọc thông tin màu từ annotation Excel
//            short backgroundColor = (excelAnnotation != null && excelAnnotation.backgroundColor() >= 0 && excelAnnotation.backgroundColor() <= 64) ? excelAnnotation.backgroundColor() : IndexedColors.WHITE.getIndex();
//            short textColor = (excelAnnotation != null && excelAnnotation.textColor() >= 0 && excelAnnotation.textColor() <= 64) ? excelAnnotation.textColor() : IndexedColors.BLACK.getIndex();
//            short headerBackgroundColor = (excelAnnotation != null && excelAnnotation.headerBackgroundColor() >= 0 && excelAnnotation.headerBackgroundColor() <= 64) ? excelAnnotation.headerBackgroundColor() : IndexedColors.LIGHT_BLUE.getIndex();
//            short headerTextColor = (excelAnnotation != null && excelAnnotation.headerTextColor() >= 0 && excelAnnotation.headerTextColor() <= 64) ? excelAnnotation.headerTextColor() : IndexedColors.WHITE.getIndex();
//
//            // Tạo style cho header
//            CellStyle boldCenterStyle = createCellStyle(workbook, boldFont, HorizontalAlignment.CENTER, headerBackgroundColor, headerTextColor);
//
//            // Tạo style cho dữ liệu thông thường
//            CellStyle normalCenterStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.CENTER, backgroundColor, textColor);
//            CellStyle normalLeftStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.LEFT, backgroundColor, textColor);
//            CellStyle normalRightStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.RIGHT, backgroundColor, textColor);
//
//            // Tạo cache cho các phương thức được đánh dấu bằng ExcelColumn
//            Map<Integer, Method> columnMethods = new HashMap<>();
//            for (Method method : clazz.getDeclaredMethods()) {
//                if (method.isAnnotationPresent(ExcelColumnGetter.class)) {
//                    ExcelColumnGetter column = method.getAnnotation(ExcelColumnGetter.class);
//                    int columnIndex = column.index();
//                    columnMethods.put(columnIndex, method);
//                    method.setAccessible(true); // Cải thiện hiệu suất reflection
//                }
//            }
//            // Tạo hàng tiêu đề
//            row = sheet.createRow(startRow);
//            if (numericalOrder) {
//                cell = row.createCell(0);
//                cell.setCellValue(numericalOrderName);
//                cell.setCellStyle(boldCenterStyle);
//            }
//            for (Map.Entry<Integer, Method> entry : columnMethods.entrySet()) {
//                int columnIndex = entry.getKey();
//                if (numericalOrder) {
//                    columnIndex += 1;
//                }
//                Method method = entry.getValue();
//                ExcelColumnGetter column = method.getAnnotation(ExcelColumnGetter.class);
//
//                cell = row.createCell(columnIndex);
//                cell.setCellValue(column.title());
//                cell.setCellStyle(boldCenterStyle);
//
//                if (column.width() != -1 && column.width() > 0) {
//                    try {
//                        sheet.setColumnWidth(columnIndex, (column.width() + 5) * 256); // Cộng thêm padding
//                    } catch (Exception e) {
//                        log.error("Lỗi khi thiết lập độ rộng cột: " + e.getMessage());
//                        sheet.setColumnWidth(columnIndex, 15 * 256);
//                    }
//                } else {
//                    try {
//                        // Đặt độ rộng cột dựa trên tiêu đề
//                        String title = column.title();
//                        if (StringUtils.hasText(title)) {
//                            sheet.setColumnWidth(columnIndex, (title.length() + 5) * 256); // Cộng thêm padding
//                        } else {
//                            sheet.setColumnWidth(columnIndex, 15 * 256);
//                        }
//                    } catch (Exception e) {
//                        log.error("Lỗi khi thiết lập độ rộng cột: " + e.getMessage());
//                        sheet.setColumnWidth(columnIndex, 15 * 256);
//                    }
//                }
//
//            }
//            // Ghi dữ liệu vào Excel
//            int rowNum = startRow + 1;
//            int index = 1;
//            for (DTO obj : dataList) {
//                row = sheet.createRow(rowNum++);
//                if (numericalOrder) {
//                    cell = row.createCell(0);
//                    cell.setCellValue(index++);
//                    cell.setCellStyle(normalCenterStyle);
//                }
//                // Sử dụng cache columnMethods thay vì quét lại các phương thức
//                for (Map.Entry<Integer, Method> entry : columnMethods.entrySet()) {
//
//                    int columnIndex = entry.getKey();
//                    Method method = entry.getValue();
//                    if (numericalOrder) {
//                        columnIndex += 1;
//                    }
//
//
//                    cell = row.createCell(columnIndex);
//                    try {
//                        Object value = method.invoke(obj);
//                        if (value != null) {
//                            setCellValue(cell, value, method.getReturnType());
//                            if (method.getReturnType() == String.class || method.getReturnType() == Date.class || method.getReturnType() == LocalDate.class || method.getReturnType() == LocalDateTime.class) {
//                                cell.setCellStyle(normalLeftStyle);
//                            } else if (method.getReturnType() == Boolean.class || method.getReturnType() == boolean.class) {
//                                cell.setCellStyle(normalCenterStyle);
//                            } else {
//                                cell.setCellStyle(normalRightStyle);
//                            }
//                        }
//                    } catch (Exception e) {
//                        log.error("Lỗi khi lấy giá trị từ method {}: {}", method.getName(), e.getMessage(), e);
//                    }
//                }
//            }
//            workbook.write(out);
//            return new ByteArrayResource(out.toByteArray());
//        } catch (Exception e) {
//            log.error("Lỗi khi tạo file Excel: {}", e.getMessage(), e);
//            return null;
//        }
//    }
//    public static <DTO extends AuditableDto> ByteArrayResource writeExcelMultiThreadWithSheets(List<DTO> dataList, Class<? extends AuditableDto> clazz) {
//        int numCores = Runtime.getRuntime().availableProcessors();
//        int threadCount = Math.max(1, numCores - 1);
//        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
//
//        try (Workbook workbook = new SXSSFWorkbook(100); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
//
//            Font defaultFont = workbook.createFont();
//            defaultFont.setFontHeightInPoints((short) 12);
//
//            Font boldFont = workbook.createFont();
//            boldFont.setBold(true);
//            boldFont.setFontHeightInPoints((short) 12);
//
//            Excel excelAnnotation = clazz.getAnnotation(Excel.class);
//            String sheetName = (excelAnnotation != null && StringUtils.hasText(excelAnnotation.name())) ? excelAnnotation.name() : "Sheet 1";
//            int startRow = (excelAnnotation != null && excelAnnotation.startRow() >= 0) ? excelAnnotation.startRow() : 0;
//            boolean numericalOrder = excelAnnotation != null && excelAnnotation.numericalOrder();
//            String numericalOrderName = excelAnnotation != null && excelAnnotation.numericalOrderName() != null ? excelAnnotation.numericalOrderName() : "";
//
//            short backgroundColor = (excelAnnotation != null) ? excelAnnotation.backgroundColor() : IndexedColors.WHITE.getIndex();
//            short textColor = (excelAnnotation != null) ? excelAnnotation.textColor() : IndexedColors.BLACK.getIndex();
//            short headerBgColor = (excelAnnotation != null) ? excelAnnotation.headerBackgroundColor() : IndexedColors.LIGHT_BLUE.getIndex();
//            short headerTextColor = (excelAnnotation != null) ? excelAnnotation.headerTextColor() : IndexedColors.WHITE.getIndex();
//
//            CellStyle boldCenterStyle = createCellStyle(workbook, boldFont, HorizontalAlignment.CENTER, headerBgColor, headerTextColor);
//            CellStyle normalCenterStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.CENTER, backgroundColor, textColor);
//            CellStyle normalLeftStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.LEFT, backgroundColor, textColor);
//            CellStyle normalRightStyle = createCellStyle(workbook, defaultFont, HorizontalAlignment.RIGHT, backgroundColor, textColor);
//
//            Map<Integer, Method> columnMethods = new HashMap<>();
//            for (Method method : clazz.getDeclaredMethods()) {
//                if (method.isAnnotationPresent(ExcelColumnGetter.class)) {
//                    ExcelColumnGetter column = method.getAnnotation(ExcelColumnGetter.class);
//                    columnMethods.put(column.index(), method);
//                    method.setAccessible(true);
//                }
//            }
//
//            // --- Tạo final sheet ---
//            Sheet finalSheet = workbook.createSheet(sheetName);
//
//            // --- Tạo header cho final sheet ---
//            Row headerRow = finalSheet.createRow(startRow);
//            int startDataRow = startRow + 1;
//
//            if (numericalOrder) {
//                Cell cell = headerRow.createCell(0);
//                cell.setCellValue(numericalOrderName);
//                cell.setCellStyle(boldCenterStyle);
//            }
//
//            for (Map.Entry<Integer, Method> entry : columnMethods.entrySet()) {
//                int columnIndex = numericalOrder ? entry.getKey() + 1 : entry.getKey();
//                Method method = entry.getValue();
//                ExcelColumnGetter column = method.getAnnotation(ExcelColumnGetter.class);
//                Cell cell = headerRow.createCell(columnIndex);
//                cell.setCellValue(column.title());
//                cell.setCellStyle(boldCenterStyle);
//
//                int width = (column.width() > 0) ? column.width() : column.title().length() + 5;
//                finalSheet.setColumnWidth(columnIndex, width * 256);
//            }
//
//            // --- Chia dữ liệu thành các batch và xử lý đa luồng ---
//            int total = dataList.size();
//            int batchSize = (int) Math.ceil((double) total / threadCount);
//            List<Future<Sheet>> futures = new ArrayList<>();
//
//            for (int i = 0; i < threadCount; i++) {
//                final int start = i * batchSize;
//                final int end = Math.min(start + batchSize, total);
//                final int batchIndex = i;
//
//                if (start >= end) continue;
//
//                Future<Sheet> future = executor.submit(() -> {
//                    // Tạo sheet tạm cho batch này
//                    Sheet tempSheet = workbook.createSheet("Temp_Batch_" + batchIndex);
//
//                    // Xử lý dữ liệu batch
//                    for (int j = start; j < end; j++) {
//                        DTO dto = dataList.get(j);
//                        Row row = tempSheet.createRow(j - start); // Row index bắt đầu từ 0 cho mỗi batch
//
//                        if (numericalOrder) {
//                            Cell indexCell = row.createCell(0);
//                            indexCell.setCellValue(j + 1); // Giữ nguyên số thứ tự gốc
//                            indexCell.setCellStyle(normalCenterStyle);
//                        }
//
//                        for (Map.Entry<Integer, Method> entry : columnMethods.entrySet()) {
//                            int colIndex = numericalOrder ? entry.getKey() + 1 : entry.getKey();
//                            Method method = entry.getValue();
//                            Cell cell = row.createCell(colIndex);
//
//                            try {
//                                Object value = method.invoke(dto);
//                                if (value != null) {
//                                    setCellValue(cell, value, method.getReturnType());
//                                    if (value instanceof String || value instanceof Date || value instanceof LocalDate || value instanceof LocalDateTime) {
//                                        cell.setCellStyle(normalLeftStyle);
//                                    } else if (value instanceof Boolean) {
//                                        cell.setCellStyle(normalCenterStyle);
//                                    } else {
//                                        cell.setCellStyle(normalRightStyle);
//                                    }
//                                }
//                            } catch (Exception e) {
//                                log.error("Lỗi khi invoke method: {}", e.getMessage(), e);
//                            }
//                        }
//                    }
//
//                    return tempSheet;
//                });
//
//                futures.add(future);
//            }
//
//            // --- Chờ tất cả các luồng hoàn thành và ghép dữ liệu ---
//            int currentRowIndex = startDataRow;
//
//            for (Future<Sheet> future : futures) {
//                try {
//                    Sheet tempSheet = future.get(); // Chờ luồng hoàn thành
//
//                    // Copy dữ liệu từ temp sheet sang final sheet
//                    int tempRowCount = tempSheet.getLastRowNum() + 1;
//                    for (int rowIdx = 0; rowIdx < tempRowCount; rowIdx++) {
//                        Row tempRow = tempSheet.getRow(rowIdx);
//                        if (tempRow != null) {
//                            Row finalRow = finalSheet.createRow(currentRowIndex++);
//
//                            // Copy từng cell
//                            for (int cellIdx = tempRow.getFirstCellNum(); cellIdx < tempRow.getLastCellNum(); cellIdx++) {
//                                Cell tempCell = tempRow.getCell(cellIdx);
//                                if (tempCell != null) {
//                                    Cell finalCell = finalRow.createCell(cellIdx);
//                                    copyCellValue(tempCell, finalCell);
//                                    finalCell.setCellStyle(tempCell.getCellStyle());
//                                }
//                            }
//                        }
//                    }
//
//                    // Xóa temp sheet
//                    workbook.removeSheetAt(workbook.getSheetIndex(tempSheet));
//
//                } catch (Exception e) {
//                    log.error("Lỗi khi lấy kết quả từ luồng: {}", e.getMessage(), e);
//                }
//            }
//
//            executor.shutdown();
//
//            // Đợi tất cả luồng kết thúc
//            try {
//                if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
//                    executor.shutdownNow();
//                }
//            } catch (InterruptedException e) {
//                executor.shutdownNow();
//                Thread.currentThread().interrupt();
//            }
//
//            workbook.write(out);
//            return new ByteArrayResource(out.toByteArray());
//
//        } catch (Exception e) {
//            log.error("Lỗi khi tạo Excel đa luồng với multiple sheets: {}", e.getMessage(), e);
//            return null;
//        }
//    }
//public static <DTO> List<DTO> readExcel(InputStream fileInputStream, Class<DTO> clazz) {
//    List<DTO> dataList = new ArrayList<>();
//    try (Workbook workbook = new XSSFWorkbook(fileInputStream)) {
//
//        // Lấy thông tin từ annotation @Excel
//        Excel excelAnnotation = clazz.getAnnotation(Excel.class);
//        Sheet sheet = workbook.getSheetAt((excelAnnotation != null) ? excelAnnotation.index() : 0);
//        int startRow = ((excelAnnotation != null) ? excelAnnotation.startRow() : 0) + 1;
//        boolean numericalOrder = excelAnnotation != null && excelAnnotation.numericalOrder();
//
//        // Lấy danh sách các phương thức setter có @ExcelColumnSetter
//        Method[] methods = clazz.getDeclaredMethods();
//        Map<Integer, Method> columnSetters = new HashMap<>();
//
//        for (Method method : methods) {
//            if (method.isAnnotationPresent(ExcelColumnSetter.class)) {
//                ExcelColumnSetter column = method.getAnnotation(ExcelColumnSetter.class);
//                columnSetters.put(column.index(), method);
//                method.setAccessible(true); // Cải thiện hiệu suất reflection
//            }
//        }
//
//        for (int rowIndex = startRow; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
//            Row row = sheet.getRow(rowIndex);
//            if (row == null) continue;
//            try {
//                // Tạo một instance của class T
//                DTO obj = clazz.getDeclaredConstructor().newInstance();
//
//                for (Map.Entry<Integer, Method> entry : columnSetters.entrySet()) {
//                    int columnIndex = entry.getKey();
//                    if (numericalOrder) {
//                        columnIndex += 1;
//                    }
//                    Method setter = entry.getValue();
//                    Cell cell = row.getCell(columnIndex);
//                    if (cell != null) {
//                        Class<?> paramType = setter.getParameterTypes()[0];
//                        setter.invoke(obj, getCellValue(cell, paramType));
//                    }
//                }
//                dataList.add(obj);
//            } catch (Exception e) {
//                log.error("Lỗi khi tạo đối tượng từ dòng {}: {}", rowIndex, e.getMessage(), e);
//            }
//        }
//    } catch (Exception e) {
//        log.error("Lỗi khi đọc file Excel: {}", e.getMessage(), e);
//    }
//    return dataList;
//}
}