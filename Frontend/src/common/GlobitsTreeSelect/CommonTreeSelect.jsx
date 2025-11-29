import React, {useEffect, useState} from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import isEqual from "lodash/isEqual";
import "./CommonTreeSelect.scss";
import "react-dropdown-tree-select/dist/styles.css";

const CommonTreeSelect = (props) => {
  const { data: propData, name, label, mode, setFieldValue, ...otherProps } = props;

  const [data, setData] = useState(propData);
  const [selectedDatas, setSelectedDatas] = useState([]);

  // Giống componentWillReceiveProps: mỗi khi propData thay đổi thì cập nhật state data
  useEffect(() => {
    if (!isEqual(propData, data)) {
      setData(propData);
    }
  }, [propData, data]);

  // Hàm uncheck tất cả
  const uncheckAll = (event) => {
    event.preventDefault();

    if (selectedDatas.length > 0) {
      // Clone để tránh mutate trực tiếp state
      const newSelectedDatas = [...selectedDatas];
      newSelectedDatas[0].checked = false;

      setSelectedDatas(newSelectedDatas);
      // Nếu muốn update data cũng cần đồng bộ ở đây nếu cần
      // hoặc bạn có thể reset data nếu checkbox checked trong data
      // nhưng ở ví dụ này mình chỉ update selectedDatas thôi

      console.log("Uncheck all:", newSelectedDatas);
    }
  };

  // Hàm onChange của DropdownTreeSelect
  const onChange = (currentNode, selectedNodes) => {
    setSelectedDatas(selectedNodes);
    if (setFieldValue && typeof setFieldValue === "function") {
      setFieldValue(name, currentNode);
    }
  };

  return (
      <>
        <DropdownTreeSelect
            id={name}
            texts={{ placeholder: label }}
            className="globits-tree-dropdown"
            mode={mode ? mode : "radioSelect"}
            onChange={onChange}
            data={data}
            {...otherProps}
        />
        <button onClick={uncheckAll}>Uncheck all</button>
      </>
  );
};

export default CommonTreeSelect;
