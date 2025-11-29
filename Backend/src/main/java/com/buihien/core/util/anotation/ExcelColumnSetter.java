package com.buihien.core.util.anotation;

import java.lang.annotation.*;

@Documented
@Target(ElementType.METHOD)
@Inherited
@Retention(RetentionPolicy.RUNTIME)
public @interface ExcelColumnSetter {

    int index();

}