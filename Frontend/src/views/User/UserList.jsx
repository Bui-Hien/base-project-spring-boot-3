import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonTable from "../../common/CommonTable";

function UserList () {
  const {t} = useTranslation ();
  const {userStore} = useStore ();

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
  } = userStore;


  const columns = [
    {
      accessorKey:"action",
      header:t ("Hành động"),
      Cell:({row}) => (
          <div className="flex items-center justify-center space-x-3">
            <Tooltip title={t ("Cập nhật thông tin")} placement="top">
              <button
                  onClick={() => handleOpenCreateEdit (row.original?.id)}
                  className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <EditIcon fontSize="small"/>
              </button>
            </Tooltip>

            <Tooltip title={t ("Xóa")} placement="top">
              <button
                  onClick={() => handleDelete (row.original)}
                  className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <DeleteIcon fontSize="small"/>
              </button>
            </Tooltip>
          </div>
      ),
    },
    {
      accessorKey:"displayName",
      header:t ("Tên người dùng"),
    },
    {
      accessorKey:"isEnabled",
      header:t ("Trạng thái tài khoản"),
      Cell:({row}) => {
        const isEnabled = row.original?.isEnabled;
        return <span>{!isEnabled? t ("Đang hoạt động") : t ("Đã bị khóa")}</span>;
      },
    },
    {
      accessorKey:"isTrusted",
      header:t ("Loại tài khoản"),
      Cell:({row}) => {
        const isTrusted = row.original?.isTrusted;
        return <span>{isTrusted? t ("Tài khoản tin cậy") : t ("Tài khoản thông thường")}</span>;
      },
    },
    {
      accessorKey:"isActive",
      header:t ("Kích hoạt"),
      Cell:({row}) => {
        const isActive = row.original?.isActive;
        return <span>{isActive? t ("Đã kích hoạt") : t ("Chưa kích hoạt")}</span>;
      },
    },
    {
      accessorKey:"email",
      header:t ("Email"),
    },
    {
      accessorKey:"bank.name",
      header:t ("Ngân hàng"),
    },
    {
      accessorKey:"beneficiaryName",
      header:t ("Tên thụ hưởng"),
    },
    {
      accessorKey:"accountNumber",
      header:t ("Số tài khoản"),
    },
    {
      accessorKey:"vipLevel.name",
      header:t ("Cấp VIP"),
    },
    {
      accessorKey:"accountCategories",
      header:t ("Loại sản phẩm được bán"),
      Cell:({row}) => {
        const accountCategories = row.original?.accountCategories || [];
        const accountCategoriesName = accountCategories
            .map ((item) => item?.name)
            .filter (Boolean)
            .join (", ");
        return <span>{accountCategoriesName}</span>;
      },
    },
    {
      accessorKey:"roles",
      header:t ("Vai trò"),
      Cell:({row}) => {
        const roles = row.original?.roles || [];
        const roleNames = roles.map ((item) => item?.name).filter (Boolean).join (", ");
        return <span>{roleNames}</span>;
      },
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

export default observer (UserList);
