import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import CommonTable from "../../common/CommonTable";
import {getDate} from "../../LocalFunction";
import {Gender} from "../../LocalConstants";
import {Checkbox, Radio, Tooltip} from "@mui/material";
import {useFormikContext} from "formik";

function CommonSelectedStaffList(props) {
    const {t} = useTranslation();
    const {staffStore} = useStore();
    const {
        name,
        multiline
    } = props;

    const {values, setFieldValue} = useFormikContext();
    const {
        totalPages,
        dataList,
        searchObject,
        totalElements,
        setPageIndex,
        setPageSize,
    } = staffStore;

    const isSelected = (staffId) => {
        if (multiline) {
            return (values[name] || []).some((item) => item?.id === staffId);
        } else {
            return values[name]?.id === staffId;
        }
    };

    const handleChange = (staff) => {
        const staffId = staff?.id;
        if (multiline) {
            const isAlreadySelected = (values[name] || []).some((item) => item?.id === staffId);
            if (isAlreadySelected) {
                const updated = values[name].filter((item) => item?.id !== staffId);
                setFieldValue(name, updated);
            } else {
                setFieldValue(name, [...(values[name] || []), staff]);
            }
        } else {
            const isAlreadySelected = values[name]?.id === staffId;
            if (isAlreadySelected) {
                setFieldValue(name, null); // Bỏ chọn nếu đã chọn
            } else {
                setFieldValue(name, staff); // Chọn mới
            }
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: "action",
            header: () => {
                if (multiline === false) {
                    return (
                        <div className="flex justify-center">
                            Hành động
                        </div>
                    )
                } else {
                    // Kiểm tra tất cả đã chọn chưa
                    const selectedCount = multiline ? (values[name] || []).length : values[name] ? 1 : 0;
                    // FIX: Chỉ tính allSelected khi dataList có dữ liệu
                    const allSelected = multiline && dataList.length > 0 && selectedCount === dataList.length;

                    const handleSelectAll = () => {
                        if (allSelected) {
                            setFieldValue(name, []); // Bỏ chọn tất cả
                        } else {
                            setFieldValue(name, dataList); // Chọn tất cả
                        }
                    };

                    return (
                        <div className="flex justify-center">
                            <Tooltip title={allSelected ? t("Bỏ chọn tất cả") : t("Chọn tất cả")}>
                                <Checkbox
                                    checked={allSelected}
                                    indeterminate={
                                        multiline && selectedCount > 0 && selectedCount < dataList.length && dataList.length > 0
                                    }
                                    onClick={handleSelectAll}
                                    disabled={!multiline || dataList.length === 0} // FIX: Disable khi chưa có data
                                />
                            </Tooltip>
                        </div>
                    );
                }
            },
            Cell: ({row}) => {
                const staff = row.original;
                const checked = isSelected(staff.id);
                return (
                    <div className="flex justify-center">
                        {multiline ? (
                                <Tooltip title={checked ? t("Bỏ chọn") : t("Chọn")}>
                                    <Checkbox
                                        checked={checked}
                                        onClick={() => handleChange(staff)}
                                    />
                                </Tooltip>
                            )
                            :
                            (
                                <Tooltip title={checked ? t("Đã chọn") : t("Chọn")}>
                                    <Radio
                                        checked={checked}
                                        onClick={() => handleChange(staff)}
                                    />
                                </Tooltip>
                            )
                        }
                    </div>
                )
                    ;
            },
        },

        {
            accessorKey: "staffCode",
            header:
                t("Mã nhân viên"),
        },
        {
            accessorKey: "displayName",
            header:
                t("Họ và tên"),
        },
        {
            accessorKey: "gender",
            header:
                t("Giới tính"),
            Cell:
                ({row}) => {
                    const value = row.original?.gender;
                    const name = Gender.getListData().find(i => i.value === value)?.name || "";
                    return <span>{name}</span>;
                }
        },
        {
            accessorKey: "birthDate",
            header:
                t("Ngày sinh"),
            Cell:
                ({row}) => {
                    const value = row.original.birthDate;
                    return <span>{getDate(value)}</span>;
                }
        },
        {
            accessorKey: "phoneNumber",
            header:
                t("Số điện thoại"),
        },
        {
            accessorKey: "email",
            header:
                t("Email"),
        },
        {
            accessorKey: "salaryTemplate",
            header:
                t("Mẫu bảng lương"),
            Cell:
                ({row}) => {
                    const value = row.original.salaryTemplate?.name || "";
                    return <span>{value}</span>;
                }
        },
    ], [values[name], dataList.length]); // FIX: Thêm dataList.length vào dependency

    return (
        <CommonTable
            data={dataList}
            columns={columns}
            nonePagination={false}
            totalPages={totalPages}
            pageSize={searchObject.pageSize}
            page={searchObject.pageIndex}
            totalElements={totalElements}
            pageSizeOption={[5, 10, 15]}
            handleChangePage={setPageIndex}
            setRowsPerPage={setPageSize}
        />
    );
}

export default observer(CommonSelectedStaffList);