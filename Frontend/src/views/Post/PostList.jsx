import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonTable from "../../common/CommonTable";
import { useNavigate } from "react-router-dom";
import { PostStatus } from "../../LocalConstants";

function PostList () {
  const {t} = useTranslation ();
  const {postStore} = useStore ();
  const navigate = useNavigate ();

  const {
    totalPages,
    handleDelete,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
    handleGetById,
    handleSelectListDelete
  } = postStore;


  const columns = [
    {
      accessorKey: "action",
      header: t("general.action"),
      Cell: ({ row }) => (
          <div className="flex items-center justify-center space-x-3">
            {/* Nút chỉnh sửa */}
            <Tooltip title={t("general.button.edit")} placement="top">
              <button
                  onClick={() => navigate(`/admin/post/edit/${row.original?.id}`)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600
                     hover:bg-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <EditIcon fontSize="small" />
              </button>
            </Tooltip>

            {/* Nút xóa */}
            <Tooltip title={t("general.button.delete")} placement="top">
              <button
                  onClick={() => handleDelete(row.original)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-600
                     hover:bg-red-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <DeleteIcon fontSize="small" />
              </button>
            </Tooltip>
          </div>
      ),
    },
    {
      accessorKey:"title",
      header:t ("post.title"),
    },
    {
      accessorKey:"status",
      header:t ("post.status"),
      Cell:({row}) => {
        const statusValue = row.original?.status; // hoặc row.getValue() tùy table lib
        const statusObj = PostStatus.getListData ().find (s => s.value === statusValue);
        return <span>{statusObj?.name || ""}</span>;
      },
    },
    {
      accessorKey:"author.displayName",
      header:t ("post.author-name"),
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
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
          handleSelectList={handleSelectListDelete}
      />
  );
}

export default observer (PostList);
