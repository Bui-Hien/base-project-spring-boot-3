import React, { useEffect } from 'react';
import { flexRender, MRT_TableBodyCellValue, useMaterialReactTable, } from 'material-react-table';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@mui/material';
import CommonPagination from "./CommonPagination";
import {useTranslation} from "react-i18next";

const CommonTable = (props) => {
  const { t } = useTranslation();
  const {
    handleSelectList,
    data = [],
    columns = [],
    selection = false,
    nonePagination = false,
    colParent = false,
    defaultExpanded = false,
    totalPages,
    handleChangePage,
    setRowsPerPage,
    pageSize = 10,
    pageSizeOption = [10, 15, 25, 30],
    totalElements,
    enableColumnPinning = false,
    pinnedLeftColumns = [], // thêm prop này
    page = 1,
    rowSelectable = null, // 👈 thêm callback prop
  } = props;

  const table = useMaterialReactTable ({
    enableColumnPinning:enableColumnPinning,
    columns,
    data,
    enableRowSelection:selection
        ? (row) => (rowSelectable? rowSelectable (row.original) : true)
        : false,
    enablePagination:!nonePagination,
    manualPagination:!!handleChangePage,
    pageCount:totalPages,
    initialState:{
      pagination:{
        pageIndex:page,
        pageSize,
      },
      expanded:colParent? {[0]:defaultExpanded} : {},
      showGlobalFilter:false,
      columnPinning:{
        left:pinnedLeftColumns,
      },
    },
    muiPaginationProps:{
      rowsPerPageOptions:pageSizeOption,
      variant:'outlined',
      onPageChange:(e, newPage) => {
        if (handleChangePage) handleChangePage (newPage);
      },
      onRowsPerPageChange:(e) => {
        if (setRowsPerPage) setRowsPerPage (Number (e.target.value));
      },
      rowsPerPage:pageSize,
      page,
      count:totalElements,
    },
    paginationDisplayMode:'pages',
    enableExpanding:colParent,
  });
  useEffect (() => {
    if (selection) {
      table.resetRowSelection ();
    }
  }, [data]);
  useEffect (() => {
    if (selection) {
      const selectedRows = table.getSelectedRowModel ().rows.map (
          (row) => row.original
      );
      handleSelectList?. (selectedRows);
    }
  }, [table.getState ().rowSelection, selection, handleSelectList]);

  const [columnNumber, setColumnNumber] = React.useState (columns.length);
  useEffect (() => {
    if (selection) {
      setColumnNumber (prev => prev + 1);
    }
    if (colParent) {
      setColumnNumber (prev => prev + 1);
    }
  }, [selection, colParent]);

  const getPinnedLeft = (column) => {
    if (!table || !column || !column.getIsPinned?. () || column.getIsPinned () !== 'left') return undefined;

    const allColumns = table.getAllLeafColumns ();
    let leftOffset = 0;
    for (const col of allColumns) {
      if (col.id === column.id) break;
      if (col.getIsPinned?. () === 'left') {
        leftOffset += 150;
      }
    }
    return leftOffset;
  };
  return (
      <Stack className={"gap-2 my-2"}>
        <TableContainer
            className={`border border-gray-300 rounded-md overflow-hidden`}
        >
          <Table
              className="w-full"
              style={{borderCollapse:'collapse'}}
          >
            <TableHead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                        <TableCell
                            align="center"
                            variant="head"
                            key={header.id}
                            className="font-bold text-sm text-gray-900 border border-gray-300 py-2 tracking-wide"
                            style={{
                              minWidth:
                                  header.column.columnDef.minWidth ??
                                  (header.column.id === "mrt-row-select" ||
                                  (colParent && index === 0)
                                      ? 50
                                      : 150),
                              maxWidth:
                                  header.column.columnDef.maxWidth ??
                                  (header.column.id === "mrt-row-select" ||
                                  (colParent && index === 0)
                                      ? 50
                                      : undefined),
                              width:
                                  header.column.columnDef?.width ??
                                  (header.column.id === "mrt-row-select" ||
                                  (colParent && index === 0)
                                      ? 50
                                      : undefined),
                              position:
                                  header.column.getIsPinned?.() === "left"
                                      ? "sticky"
                                      : undefined,
                              left: getPinnedLeft(header.column),
                              zIndex: 10,
                              backgroundColor: "#f5f5f5",
                            }}
                        >
                          {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.Header ??
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                        </TableCell>
                    ))}
                  </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {data.length > 0? (
                  table.getRowModel ().rows.map ((row, rowIndex) => (
                      <TableRow
                          key={row.id}
                          selected={row.getIsSelected ()}
                          className="hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells ().map ((cell, index) => (
                            <TableCell
                                align={cell.column.id === 'mrt-row-select'? 'center' : 'left'}
                                variant="body"
                                key={cell.id}
                                style={{
                                  minWidth:cell.column.columnDef.minWidth ?? (cell.column.id === 'mrt-row-select' || (colParent && index === 0)? 50 : 150),
                                  maxWidth:cell.column.columnDef.maxWidth ?? undefined,
                                  width:cell.column.columnDef?.width ?? undefined,
                                  position:cell.column.getIsPinned?. () === 'left'? 'sticky' : undefined,
                                  left:getPinnedLeft (cell.column),
                                  zIndex:10,
                                  backgroundColor:'white',
                                }}
                                className="text-sm text-gray-800 border border-gray-300 py-2"
                            >
                              <MRT_TableBodyCellValue
                                  cell={cell}
                                  table={table}
                                  staticRowIndex={rowIndex}
                              />
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell
                        align="center"
                        colSpan={columnNumber}
                        className="text-sm text-gray-500 border border-gray-300 py-5"
                    >
                      {t("table.no-data")}
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalElements >0 && (
            <CommonPagination
                nonePagination={nonePagination}
                totalElements={totalElements}
                pageSize={pageSize}
                pageSizeOption={pageSizeOption}
                setRowsPerPage={setRowsPerPage}
                totalPages={totalPages}
                handleChangePage={handleChangePage}
                page={page}
            />
        )}
      </Stack>
  );
};

export default React.memo (CommonTable);