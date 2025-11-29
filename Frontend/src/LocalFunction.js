import moment from 'moment-timezone';
import React from "react";
import { toast } from "react-toastify";
import i18n from "i18next";

moment.tz.setDefault ("Asia/Ho_Chi_Minh");

export function isSameDate (date1, date2) {
  if (date1 === null || date2 === null || date1 === undefined || date2 === undefined) return false;
  const d1 = new Date (date1);
  const d2 = new Date (date2);

  return (
      d1.getFullYear () === d2.getFullYear () &&
      d1.getMonth () === d2.getMonth () &&
      d1.getDate () === d2.getDate ()
  );
}

export function getTimeSchedule (hour, minute) {
  const date = new Date ();
  date.setHours (hour);
  date.setMinutes (minute);
  date.setSeconds (0);
  date.setMilliseconds (0);
  return date;
}

export function removeVietnameseTones (str) {
  return str
      .normalize ("NFD")
      .replace (/[\u0300-\u036f]/g, "") // bỏ dấu
      .replace (/đ/g, "d")
      .replace (/Đ/g, "D")
      .replace (/[^a-zA-Z0-9\s]/g, "") // bỏ ký tự đặc biệt
      .trim ();
}

export function getDate (date, titleNoDate = '', stringFormate = 'DD/MM/YYYY') {
  return (date && moment.tz (date, "Asia/Ho_Chi_Minh").isValid ())
      ? moment.tz (date, "Asia/Ho_Chi_Minh").format (stringFormate)
      : titleNoDate;
}

export function getMonth (date) {
  return new Date (date).getMonth ();
}

export function getFullYear (date) {
  return new Date (date).getFullYear ();
}

export function getDay (date) {
  return new Date (date).getDay ();
}

export function getMinutes (date) {
  return new Date (date).getMinutes ();
}

export function formatDate(stringFormat = "DD/MM/YYYY", date) {
  if (!date) return "";
  const m = moment.tz(date, "Asia/Ho_Chi_Minh");
  if (!m.isValid()) return "";
  return m.format(stringFormat);
}


export function formatDateTime (stringFormat = 'DD/MM/YYYY HH:mm:ss', date) {
  return date? moment.tz (date, "Asia/Ho_Chi_Minh").format (stringFormat) : '';
}


export function getVietnameseWeekday (dateInput) {
  if (!dateInput) return "";

  const date = new Date (dateInput);

  // Define weekday mappings
  const weekdays = {
    0:"Chủ nhật",
    1:"Thứ 2",
    2:"Thứ 3",
    3:"Thứ 4",
    4:"Thứ 5",
    5:"Thứ 6",
    6:"Thứ 7"
  };

  return weekdays[date.getDay ()];
}

export function getShortVietnameseWeekday (dateInput) {
  if (!dateInput) return "";

  const date = new Date (dateInput);

  // Define weekday mappings
  const weekdays = {
    0:"CN",
    1:"T2",
    2:"T3",
    3:"T4",
    4:"T5",
    5:"T6",
    6:"T7"
  };

  return weekdays[date.getDay ()];
}

export function getFirstDateOfMonth () {
  const now = new Date ();
  return new Date (now.getFullYear (), now.getMonth (), 1)

}

export function getLastDateOfMonth () {
  const now = new Date ();
  return new Date (now.getFullYear (), now.getMonth () + 1, 0)

}

export function getFirstDateOfWeek () {
  const now = new Date ();
  const dayOfWeek = now.getDay (); // 0 (Sunday) to 6 (Saturday)
  const diff = now.getDate () - dayOfWeek + (dayOfWeek === 0? -6 : 1); // Adjust if Sunday
  return new Date (now.setDate (diff));
}

export function getLastDateOfWeek () {
  const firstDateOfWeek = getFirstDateOfWeek ();
  return new Date (firstDateOfWeek.setDate (firstDateOfWeek.getDate () + 6));
}

export function equalComparisonDate (date1, date2, type) {
  // Ensure both dates are Date objects
  const newDate1 = typeof date1 === 'number'? new Date (date1) : new Date (date1);
  const newDate2 = typeof date2 === 'number'? new Date (date2) : new Date (date2);

  if (!type) {
    // Normalize to only compare the year, month, and day
    const normalizedDate1 = new Date (newDate1.getFullYear (), newDate1.getMonth (), newDate1.getDate ()).getTime ();
    const normalizedDate2 = new Date (newDate2.getFullYear (), newDate2.getMonth (), newDate2.getDate ()).getTime ();
    return normalizedDate1 === normalizedDate2;
  }

  if (type === 'month') {
    // Normalize to only compare the year and month
    const normalizedDate1 = new Date (newDate1.getFullYear (), newDate1.getMonth ()).getTime ();
    const normalizedDate2 = new Date (newDate2.getFullYear (), newDate2.getMonth ()).getTime ();
    return normalizedDate1 === normalizedDate2;
  }

  return false; // Default case
}

export const getImageNameAndType = (name) => {
  if (name) {
    return name.split (".")[0] + "/" + name.split (".")[1];
  }
  return "";
};

export const ToAlphabet = (str) => {
  return str
      .normalize ("NFD")
      .replace (/[\u0300-\u036f]/g, "")
      .replace (/đ/g, "d")
      .replace (/Đ/g, "D")
      .toLowerCase ();
};

export function getChildren (members, name = 'children') {
  let children = [];

  if (members?.length > 0) {
    return members.map ((m) => {
      if (m[name] && m[name].length) {
        children = [... children, ... m[name]];
      }
      return m;
    }).concat (children.length? getChildren (children, name) : children);
  } else {
    return children
  }
};

export function getTextWidth (text, fontSize) {
  let element = document.createElement ("span");
  document.body.appendChild (element);

  element.style.height = "auto";
  element.style.width = "auto";
  element.style.position = "absolute";
  element.style.zIndex = "-999";
  element.style.whiteSpace = "no-wrap";
  if (fontSize) {
    element.style.fontSize = fontSize + "px";
  }
  element.innerHTML = text + "";

  const width = Math.ceil (element.clientWidth);
  document.body.removeChild (element);
  return width;
}

export const RequiredLabel = React.memo (() => {
  return (
      <span style={{color:'red'}}>*</span>
  )
});

export function containsOnlyNumbers (str) {
  return /^\d+$/.test (str);
}

export function transformDate (castValue, originalValue) {
  return this.isType (castValue)? castValue : new Date (originalValue);
}

export function formatMoney (number, unit = 'VNĐ') {
  if (number === null || number === "" || isNaN (number)) {
    return "-";
  }
  if (typeof number === "string") {
    number = Number.parseFloat (number);
  }

  if (typeof number !== "number" || isNaN (number)) {
    return "-";
  }

  return (number.toFixed ().toString ().replace (/\B(?=(\d{3})+(?!\d))/g, ',') + (unit? " " + unit : ""));
}

export const formatVNDMoney = (value) => {
  if (value === null || value === undefined || isNaN (value)) return "0 ₫";
  return Number (value).toLocaleString ("vi-VN", {
    style:"currency",
    currency:"VND",
  });
};

export const formatShortMoney = (value) => {
  if (value === null || value === undefined || isNaN (value)) return "0";
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed (1) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed (1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed (1) + "K";
  return value.toLocaleString ("vi-VN");
};

// TO DO IF ELSE - SALARY_ITEM_VALUE_TYPE
export function formatValue (displayValue, displayValueType) {
  // Kiểm tra nếu item không có valueType thì trả về giá trị gốc
  if (!displayValue || !displayValueType) {
    return displayValue;
  }

  // Kiểm tra các loại valueType và thực hiện định dạng tương ứng
  switch (displayValueType) {
    case 1: // TEXTs
      return displayValue;  // Giữ nguyên

    case 2: // MONEY
      return `${formatVNDMoney (displayValue)} VNĐ`;  // Thêm VNĐ vào

    case 3: // NUMBER
      return Number (displayValue) % 1 === 0? Number (displayValue).toFixed (0) : displayValue;  // Giữ nguyên

    case 4: // PERCENT
      return `${displayValue}%`;  // Thêm % vào

    case 5: // OTHERS
      return displayValue;  // Giữ nguyên

    default:
      return displayValue;  // Trường hợp mặc định trả về giá trị gốc
  }
}


export function getFileType (filename) {
  const extension = filename.split ('.').pop ().toLowerCase ();
  if (extension === "png"
      || extension === "jpeg"
      || extension === "gif"
      || extension === "bmp"
      || extension === "pdf"
      || extension === "csv"
      || extension === "xslx"
      || extension === "docx"
      || extension === "mp4"
      || extension === "webm"
      || extension === "mp3"
  )
    return extension;
  return null;
}

export function bytesToKB (bytes) {
  const size = (bytes / 1024).toFixed (2); // toFixed(2) ensures two decimal places
  if (size) return size + " KB";
  return "";
}

export function getDateTime (date, titleNoDate = '', stringFormate = 'DD/MM/YYYY HH:mm') {
  return (date && moment.tz (date, "Asia/Ho_Chi_Minh").isValid ())
      ? moment.tz (date, "Asia/Ho_Chi_Minh").format (stringFormate)
      : titleNoDate;
}

export const checkSearchObject = (oldValue, newValue) => {
  if ("pageIndex" in newValue && "pageSize" in newValue) {
    oldValue = {... newValue, pageSize:oldValue.pageSize, pageIndex:1};
  } else if ("pageIndex" in newValue) {
    oldValue.pageIndex = newValue.pageIndex;
  } else if ("pageSize" in newValue) {
    oldValue.pageSize = newValue.pageSize;
    oldValue.pageIndex = 1;
  }

  return {... oldValue, keyword:oldValue?.keyword?.trim ()};
}

export const getFormData = (object) => {
  const formData = new FormData ();

  for (const key in object) {
    formData.append (key, object[key]);
  }

  return formData;
};

export function getTime (value, format = "HH:mm") {
  return value && moment.tz (value, "Asia/Ho_Chi_Minh").isValid ()
      ? moment.tz (value, "Asia/Ho_Chi_Minh").format (format)
      : "";
}

export const formatNumber = (value) => {
  if (value === null || isNaN (value)) return "0";
  const num = parseFloat (value);
  return num % 1 === 0? num.toFixed (0) : num.toFixed (2);
};

export const getCheckInAndCheckOutTimeOfShiftWork = (shiftWork) => {
  if (!shiftWork || !shiftWork.timePeriods || shiftWork.timePeriods.length === 0) {
    return {checkInTime:null, checkOutTime:null};
  }

  // Sort timePeriods by startTime to find the earliest and latest
  const sortedPeriods = shiftWork.timePeriods.sort ((a, b) =>
      new Date (a.startTime) - new Date (b.startTime)
  );

  return {
    checkInTime:sortedPeriods[0].startTime, // Earliest start time
    checkOutTime:sortedPeriods[sortedPeriods.length - 1].endTime // Latest end time
  };
}


export const calculateDateDifference = (date1, date2) => {
  if (!date1 || !date2) return 0;

  const d1 = new Date (date1);
  const d2 = new Date (date2);

  // Kiểm tra định dạng hợp lệ
  if (isNaN (d1.getTime ()) || isNaN (d2.getTime ())) {
    return 0;
  }

  const diffTime = Math.abs (d2 - d1);
  const diffDays = Math.ceil (diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export const getStartMonth = (date = new Date ()) => {
  return new Date (date.getFullYear (), date.getMonth (), 1, 0, 0, 0, 0);
};

export const getEndMonth = (date = new Date ()) => {
  return new Date (date.getFullYear (), date.getMonth () + 1, 0, 23, 59, 59, 999);
};

// Lấy ngày bắt đầu của tuần (Monday)
export const getStartWeek = (date = new Date ()) => {
  const d = new Date (date);
  const day = d.getDay (); // 0 = Sunday, 1 = Monday, ...
  const diff = d.getDate () - day + (day === 0? -6 : 1); // nếu Sunday => -6 để về Monday
  return new Date (d.setDate (diff));
};

// Lấy ngày kết thúc của tuần (Sunday)
export const getEndWeek = (date = new Date ()) => {
  const d = getStartWeek (date);
  return new Date (d.getFullYear (), d.getMonth (), d.getDate () + 6, 23, 59, 59, 999);
};


export const Years = (() => {
  const currentYear = new Date ().getFullYear ();
  const yearEnum = {};

  for (let year = 2020; year <= currentYear; year++) {
    yearEnum[`Y${year}`] = {value:year, name:year};
  }

  yearEnum.getListData = function () {
    return Object.keys (this)
        .filter (key => typeof this[key] === 'object' && 'value' in this[key])
        .map (key => this[key]);
  };

  return yearEnum;
}) ();


export const getMessageResponse = (data) => {
  if (data?.status < 400) {
    if (data?.message) {
      toast.success (data?.message);
    } else {
      toast.success (i18n.t ("toast.save_success"));
    }
  } else {
    if (data?.message) {
      toast.error (data?.message);
    } else {
      toast.error (i18n.t ("toast.error"));
    }
  }
};
export const safeClone = (obj) => {
  try {
    return JSON.parse (JSON.stringify (obj));
  } catch (error) {
    return obj;
  }
};

export const convertDates = (obj) => {
  for (const key in obj) {
    const value = obj[key];

    if (value instanceof Date) {
      obj[key] = moment (value)
          .tz ("Asia/Ho_Chi_Minh")
          .format ("YYYY-MM-DDTHH:mm:ss");
    } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test (value)) {
      const m = moment (value);
      if (m.isValid ()) {
        obj[key] = m.tz ("Asia/Ho_Chi_Minh").format ("YYYY-MM-DDTHH:mm:ss");
      }
    } else if (typeof value === "object" && value !== null) {
      convertDates (value);
    }
  }
};

export const removeEmptyFields = (obj) => {
  if (Array.isArray (obj)) {
    return obj
        .map (item => removeEmptyFields (item))
        .filter (item => item !== null && item !== undefined);
  } else if (typeof obj === 'object' && obj !== null) {
    const cleaned = {};
    Object.keys (obj).forEach (key => {
      const value = removeEmptyFields (obj[key]);
      if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !(typeof value === 'object' && Object.keys (value).length === 0)
      ) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }
  return obj;
};

export const createPathRegex = (path) => new RegExp (`^${path.replace(/:id/g, '[^/]+').replace(/\//g, '\\/')}$`);
export const findMatchingRoute = (pathname, routeList) => routeList.find (route => createPathRegex (route.path).test (pathname));
export const isRouteProtected = (pathname, routeList) => findMatchingRoute (pathname, routeList)?.auth?.length > 0;
export const hasRequiredRole = (userRoles, requiredRoles) => !requiredRoles?.length || requiredRoles.some (role => userRoles?.includes (role));