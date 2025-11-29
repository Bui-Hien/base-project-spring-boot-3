import React from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";
import { Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CommonTable from "../../common/CommonTable";
import { ValueType } from "../../LocalConstants";

function SystemConfigList () {
  const {t} = useTranslation ();
  const {systemConfigStore} = useStore ();

  const {
    handleOpenCreateEdit,
    totalPages,
    dataList,
    searchObject,
    totalElements,
    setPageIndex,
    setPageSize,
  } = systemConfigStore;


  const columns = [
    {
      accessorKey: "action",
      header: t("general.action"),
      Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Tooltip title={t("general.button.edit")} placement="top">
              <button
                  onClick={() => handleOpenCreateEdit(row.original.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-full
                     bg-blue-50 text-blue-600
                     hover:bg-blue-100 hover:text-blue-700
                     transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <EditIcon fontSize="small" />
              </button>
            </Tooltip>
          </div>
      ),
    },
    {
      accessorKey:"key",
      header:
          t ("system-config.key"),
    },
    {
      accessorKey:"type",
      header:
          t ("system-config.type"),
      Cell:({row}) => (
          <span>
                  {ValueType.getListData ().find (item => item.type === row?.type)?.name || ''}
                </span>
      ),
    },
    {
      accessorKey:"value",
      header:
          t ("system-config.value"),
    },
    {
      accessorKey:"description",
      header:
          t ("system-config.description"),
    },
  ];

  return (
      <CommonTable
          data={dataList}
          columns={columns}
          selection={false}
          nonePagination={false}
          totalPages={totalPages}
          pageSize={searchObject.pageSize}
          page={searchObject.pageIndex}
          totalElements={totalElements}
          pageSizeOption={[10, 15, 20, 30]}
          handleChangePage={setPageIndex}
          setRowsPerPage={setPageSize}
      />
  );
}

export default observer (SystemConfigList);
