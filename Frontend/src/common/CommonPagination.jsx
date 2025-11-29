import React, { memo } from "react";
import { MenuItem, Pagination, Select, Stack, Typography, } from "@mui/material";
import { useTranslation } from "react-i18next";

const CommonPagination = ({
                            totalElements = 0,
                            pageSize = 10,
                            pageSizeOption = [10, 15, 25, 30],
                            totalPages = 1,
                            page = 1,
                            handleChangePage,
                            setRowsPerPage,
                          }) => {
  const { t } = useTranslation();

  return (
      <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{px:2}}
          spacing={2}
      >
        <Typography variant="body2">
          {t("table.total-elements")}{" "}{totalElements}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">{t("table.rows-per-page")}</Typography>
          <Select
              value={pageSize}
              onChange={(e) => setRowsPerPage?. (Number (e.target.value))}
              size="small"
          >
            {pageSizeOption.map ((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
            ))}
          </Select>

          <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => handleChangePage?. (value)}
              color="primary"
              shape="rounded"
              size="medium"
          />
        </Stack>
      </Stack>
  );
};

export default memo (CommonPagination);
