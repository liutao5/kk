import { HEADER } from "@/config-global";
import useResponsive from "@/hooks/useResponsive";
import { Box } from "@mui/material";
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridPrintGetRowsToExportParams,
  GridRowId,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
  zhCN
} from "@mui/x-data-grid-premium";
import { format } from "date-fns";
import { ReactElement } from "react";

function CustomToolbar(
  children?: ReactElement,
  hasExport = false,
  fileName: string = "filename"
) {
  return (
    <GridToolbarContainer>
      {children}
      {hasExport && <GridToolbarExport csvOptions={{fileName: `${fileName}_${format(new Date(), 'yyyyMMddHHmmss')}`}} excelOptions={{fileName: `${fileName}_${format(new Date(), 'yyyyMMddHHmmss')}`}}  />}
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

const getSelectedRowsToExport = ({
  apiRef,
}: GridPrintGetRowsToExportParams): GridRowId[] => {
  const selectedRowIds = selectedGridRowsSelector(apiRef);
  if (selectedRowIds.size > 0) {
    return Array.from(selectedRowIds.keys());
  }

  return gridFilteredSortedRowIdsSelector(apiRef);
};

export default function FetchTable(
  props: DataGridPremiumProps & {
    customToobar?: ReactElement;
    hasExport?: boolean;
    fileName?: string;
  }
) {
  const { columns, rows, customToobar, hasExport, fileName } = props;
  const isDesktop = useResponsive("up", "lg");

  return (
    <Box
      sx={{
        "& .header-style": {
          backgroundColor: "#fafafa",
        },
        ...(isDesktop && {
          height: `calc(100vh - ${HEADER.H_DASHBOARD_DESKTOP + 210}px)`,
        }),
      }}
    >
      <DataGridPremium
        {...props}
        autoHeight
        columns={columns.map((columns) => ({
          ...columns,
          headerClassName: "header-style",
        }))}
        disableColumnMenu
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        pagination
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{
          toolbar: () => CustomToolbar(customToobar, hasExport, fileName),
        }}
        slotProps={{
          toolbar: {
            csvOptions: {
              disableToolbarButton: true,
            },
            printOptions: {
              disableToolbarButton: true,
              getRowsToExport: getSelectedRowsToExport,
              hideToolbar: true,
            },
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
