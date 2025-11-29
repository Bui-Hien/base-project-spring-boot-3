import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import CommonTable from "../../common/CommonTable";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AccountCategoryType } from "../../LocalConstants";

function AccountCategoryList () {
  const {t} = useTranslation ();
  const {accountCategoryStore} = useStore ();

  const {
    handleOpenCreateEdit,
    totalPages,
    handleDelete,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleSelectListDelete
  } = accountCategoryStore;


  const columns = [
    {
      accessorKey: "action",
      header: t("Thao tác"),
      Cell: ({ row }) => (
          <div className="flex items-center justify-center space-x-3">
            {/* Nút sửa */}
            <Tooltip title={t("Cập nhật thông tin")} placement="top">
              <button
                  onClick={() => handleOpenCreateEdit(row.original?.id)}
                  className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <EditIcon fontSize="small" />
              </button>
            </Tooltip>

            {/* Nút xóa */}
            <Tooltip title={t("Xóa")} placement="top">
              <button
                  onClick={() => handleDelete(row.original)}
                  className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <DeleteIcon fontSize="small" />
              </button>
            </Tooltip>
          </div>
      ),
    },
    {
      accessorKey:"code",
      header:t ("Mã loại"),
    },
    {
      accessorKey:"name",
      header:t ("Loại tài khoản"),
    },
    {
      accessorKey:"type",
      header:t ("Cách tính"),
      Cell:({row}) => {
        let value = row.original?.type;
        const status = AccountCategoryType.getListData ().find (i => i.value === value);
        return (
            <span>
                {status?.name || "-"}
            </span>
        );
      },
    },
    {
      accessorKey:"percentage",
      header:t ("Hệ số chiết khấu(%)"),
    },
    {
      accessorKey:"description",
      header:t ("Mô tả"),
    },
  ];

  return (
      <CommonTable
          data={dataList}
          columns={columns}
          selection={true}
          nonePagination={false}
          totalPages={totalPages}
          pageSize={searchObject.pageSize}
          page={searchObject.pageIndex}
          totalElements={totalElements}
          pageSizeOption={[5, 10, 15]}
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
          handleSelectList={handleSelectListDelete}
      />
  );
}

export default observer (AccountCategoryList);
