import React, { useEffect, useState } from "react";
import { FastField, getIn } from "formik";
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import viLocale from "date-fns/locale/vi";
import moment from "moment";

const configDefaultForm = {
  size: "medium",
  variant: "outlined",
  fullWidth: true,
  debounceTime: 200,
  notValueMillisecond: false,
};

const CommonDateTimePicker = (props) => (
    <FastField
        {...props}
        name={props.name}
        shouldUpdate={shouldComponentUpdate}
    >
      {({ field, meta, form }) => {
        return (
            <Component
                {...props}
                field={field}
                meta={meta}
                setFieldValue={form.setFieldValue}
                formik={form}
            />
        );
      }}
    </FastField>
);

const Component = ({
                     disabled,
                     fullWidth = configDefaultForm.fullWidth,
                     label,
                     name,
                     size = configDefaultForm.size,
                     variant = configDefaultForm.variant,
                     className = "",
                     debounceTime = configDefaultForm.debounceTime,
                     notDelay,
                     field,
                     meta,
                     requiredLabel,
                     required,
                     onChange,
                     readOnly = false,
                     InputProps,
                     InputLabelProps,
                     disablePast = false,
                     disableFuture = false,
                     isDateTimePicker,
                     isDateTimeSecondsPicker,
                     isTimePicker,
                     format = isTimePicker
                         ? "HH:mm"
                         : "dd/MM/yyyy" + (isDateTimeSecondsPicker ? " HH:mm:ss" : isDateTimePicker ? " HH:mm" : ""),
                     minDate,
                     maxDate,
                     minDateMessage = "Ngày không hợp lệ",
                     maxDateMessage = "Ngày không hợp lệ",
                     okLabel = "CHỌN",
                     cancelLabel = "HUỶ",
                     setFieldValue,
                     tabIndex,
                     formik,
                     views,
                     ...otherProps
                   }) => {
  // ✅ Cải thiện parseToDate để xử lý an toàn hơn
  const parseToDate = (val) => {
    if (!val && val !== 0) return null;

    // Nếu đã là Date object
    if (val instanceof Date) {
      return isNaN(val.getTime()) ? null : val;
    }

    // Nếu là timestamp (number)
    if (typeof val === "number") {
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    }

    // Nếu là string
    if (typeof val === "string") {
      // Thử parse ISO 8601 format
      const m = moment(val);
      if (m.isValid()) return m.toDate();

      // Thử parse DD/MM/YYYY
      const m2 = moment(val, "DD/MM/YYYY", true);
      if (m2.isValid()) return m2.toDate();

      // Thử parse trực tiếp
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  };

  const [value, setValue] = useState(() => parseToDate(field.value));
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    const parsedDate = parseToDate(field.value);
    setValue(parsedDate);
  }, [field.value]);

  const handleChange = (newValue) => {
    if (readOnly || disabled) return;

    setValue(newValue);

    // ✅ Chuyển sang ISO string hoặc null
    let newDate = null;
    if (newValue instanceof Date && !isNaN(newValue.getTime())) {
      // Chuyển sang ISO string với timezone Asia/Ho_Chi_Minh
      newDate = moment(newValue).tz("Asia/Ho_Chi_Minh").format();
    }

    if (!notDelay) {
      if (debounceTimer) clearTimeout(debounceTimer);

      setDebounceTimer(
          setTimeout(() => {
            if (onChange) {
              onChange(newDate);
            } else {
              setFieldValue(name, newDate);
            }
          }, debounceTime)
      );
    } else {
      if (onChange) {
        onChange(newDate);
      } else {
        setFieldValue(name, newDate);
      }
    }
  };

  const isError = meta?.touched && Boolean(meta?.error);

  // ✅ Cấu hình props cho picker
  const pickerProps = {
    ...otherProps,
    value,
    onChange: handleChange,
    disabled: disabled || readOnly,
    format, // ✅ Dùng format thay vì inputFormat (MUI v6)
    views: views || ["year", "month", "day"], // ✅ Thêm views vào đây
    minDate,
    maxDate,
    minDateMessage,
    maxDateMessage,
    showToolbar: true,
    disablePast,
    disableFuture,
    className: `input-container ${className} ${disabled ? "read-only" : ""}`,
    slotProps: {
      textField: {
        variant,
        size,
        fullWidth,
        error: isError,
        helperText: fullWidth && isError ? meta.error : "",
        InputProps: {
          ...InputProps,
          readOnly: readOnly,
          sx: {
            height: "40px",
            "& .MuiInputBase-input": {
              height: "40px",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
            },
            ...(readOnly
                ? {
                  color: "rgba(0, 0, 0, 0.87)",
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  opacity: 1,
                }
                : {}),
          },
        },
        inputProps: {
          tabIndex,
          readOnly: readOnly,
          style: readOnly
              ? {
                color: "rgba(0, 0, 0, 0.87)",
                cursor: "not-allowed",
                opacity: 1,
              }
              : undefined,
        },
        InputLabelProps: {
          shrink: true,
          ...InputLabelProps,
          htmlFor: name,
        },
      },
    },
  };

  return (
      <div className="flex flex-col w-full">
        {label && (
            <label htmlFor={name} className="label-container">
              {label} {required ? <span style={{ color: "red" }}> * </span> : null}
            </label>
        )}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
          {isDateTimePicker ? (
              <DateTimePicker fullWidth={fullWidth} {...pickerProps} />
          ) : isTimePicker ? (
              <TimePicker fullWidth={fullWidth} {...pickerProps} />
          ) : (
              <DatePicker {...pickerProps} fullWidth={fullWidth} />
          )}
        </LocalizationProvider>
      </div>
  );
};

// Hàm so sánh để FastField chỉ rerender khi cần thiết
const shouldComponentUpdate = (nextProps, currentProps) => {
  return (
      nextProps.name !== currentProps.name ||
      nextProps.value !== currentProps.value ||
      nextProps.onChange !== currentProps.onChange ||
      nextProps.disablePast !== currentProps.disablePast ||
      nextProps.disableFuture !== currentProps.disableFuture ||
      nextProps.label !== currentProps.label ||
      nextProps.required !== currentProps.required ||
      nextProps.disabled !== currentProps.disabled ||
      nextProps.readOnly !== currentProps.readOnly ||
      nextProps.formik.isSubmitting !== currentProps.formik.isSubmitting ||
      Object.keys(nextProps).length !== Object.keys(currentProps).length ||
      getIn(nextProps.formik.values, currentProps.name) !==
      getIn(currentProps.formik.values, currentProps.name) ||
      getIn(nextProps.formik.errors, currentProps.name) !==
      getIn(currentProps.formik.errors, currentProps.name) ||
      getIn(nextProps.formik.touched, currentProps.name) !==
      getIn(currentProps.formik.touched, currentProps.name)
  );
};

export default React.memo(CommonDateTimePicker);