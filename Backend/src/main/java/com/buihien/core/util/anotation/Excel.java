package com.buihien.core.util.anotation;

//vào đây để lấy mã màu tham khảo
//import org.apache.poi.ss.usermodel.IndexedColors;

import java.lang.annotation.*;

@Documented
@Target(ElementType.TYPE)
@Inherited
@Retention(RetentionPolicy.RUNTIME)
public @interface Excel {

    int index() default 0;

    int startRow() default 0;

    String name() default "Sheet 1";

    boolean numericalOrder() default false;

    String numericalOrderName() default "Numerical order";

    // Màu nền toàn bảng
    // IndexedColors.WHITE.getIndex()
    short backgroundColor() default 9;

    // Màu chữ toàn bảng
    // IndexedColors.BLACK.getIndex()
    short textColor() default 8;

    // Màu nền của header
    // IndexedColors.LIGHT_BLUE.getIndex()
    short headerBackgroundColor() default 48;

    // Màu chữ của header
    // IndexedColors.WHITE.getIndex()
    short headerTextColor() default 9;
}