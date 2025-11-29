import {useFormikContext} from 'formik';
import {useEffect} from 'react';
import {toast} from 'react-toastify';
import lodash from 'lodash';

const FormikFocusError = () => {
  const { errors, isSubmitting, isValidating, touched } = useFormikContext();

  useEffect(() => {
    // Khi submit và form không còn đang validating, có lỗi mới tiến hành xử lý
    if (isSubmitting && !isValidating && errors && Object.keys(errors).length > 0) {
      const errorPaths = getLeaves(errors);

      // Tìm lỗi đầu tiên đã touched
      let firstErrorPath = errorPaths.find(path => lodash.get(errors, path) && lodash.get(touched, path));

      // Nếu không có lỗi touched thì lấy lỗi đầu tiên
      if (!firstErrorPath && errorPaths.length > 0) {
        firstErrorPath = errorPaths[0];
      }

      if (firstErrorPath) {
        const errorMessage = lodash.get(errors, firstErrorPath);
        const fieldName = getFieldName(firstErrorPath);

        // Hiển thị thông báo lỗi
        toast.warning(`${fieldName}: ${errorMessage}`, {
          autoClose: 3000,
          toastId: 'formik-focus-error',
        });

        // Tìm phần tử lỗi trên DOM
        const errorElement = getErrorElement(firstErrorPath);
        if (errorElement) {
          // Delay để DOM có thể render đầy đủ và chuyển tab nếu cần
          setTimeout(() => {
            focusTabOfElement(errorElement);

            // Delay nữa để scroll + focus
            setTimeout(() => {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              errorElement.focus({ preventScroll: true });
            }, 300);
          }, 300);
        }
      }
    }
  }, [errors, isSubmitting, isValidating, touched]);

  return null;
};

/**
 * Đệ quy lấy tất cả đường dẫn leaf keys trong object errors
 * Ví dụ: { a: { b: "error" } } -> ["a.b"]
 */
const getLeaves = (tree) => {
  const leaves = [];
  const walk = (obj, path = '') => {
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      const newPath = Array.isArray(obj) ? `${path}[${key}]` : (path ? `${path}.${key}` : key);

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        walk(obj[key], newPath);
      } else {
        leaves.push(newPath);
      }
    }
  };
  walk(tree);
  return leaves;
};

/**
 * Tìm element lỗi dựa trên id hoặc name hoặc label cho fieldPath
 */
const getErrorElement = (fieldPath) => {
  // Chuyển path object thành dạng id (ví dụ: user.address[0].city -> user-address-0-city)
  const id = fieldPath.replace(/\[(\d+)\]/g, '-$1').replace(/\./g, '-');

  // Tìm theo id, name hoặc label for id
  return document.getElementById(id) ||
      document.querySelector(`[name="${fieldPath}"]`) ||
      document.getElementById(`label-for-${fieldPath}`);
};

/**
 * Lấy tên trường thân thiện để hiển thị thông báo lỗi
 */
const getFieldName = (fieldPath) => {
  const id = fieldPath.replace(/\[(\d+)\]/g, '-$1').replace(/\./g, '-');
  const label = document.querySelector(`label[for="${id}"]`);
  if (label) {
    return label.innerText?.trim() || label.textContent?.trim() || id;
  }

  // Nếu không tìm thấy label, lấy phần cuối của path rồi format
  const lastPart = fieldPath.split(/[\.\[\]]+/).filter(Boolean).pop();
  return lastPart
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
};

/**
 * Tự động focus vào tab chứa phần tử lỗi
 * Tìm phần tử cha có class `.tab-pane-custom` rồi click tab tương ứng
 */
const focusTabOfElement = (element) => {
  if (!element) return;

  const tabPane = element.closest('.tab-pane-custom');
  if (tabPane) {
    const tabPanelId = tabPane.getAttribute('id');
    if (tabPanelId) {
      const tabButton = document.querySelector(`[role="tab"][aria-controls="${tabPanelId}"]`);
      if (tabButton) {
        tabButton.click(); // mô phỏng click chuyển tab
      }
    }
  }
};

export default FormikFocusError;
