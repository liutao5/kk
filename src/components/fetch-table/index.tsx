import { Box } from "@mui/material";
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridRowsProp,
  GridToolbar,
  zhCN,
} from "@mui/x-data-grid-premium";

export default function FetchTable(props: DataGridPremiumProps) {
  const { columns, rows } = props;

  return (
    <Box
      sx={{
        "& .header-style": {
          backgroundColor: "#fafafa",
        },
      }}
    >
      <DataGridPremium
        columns={columns.map((columns) => ({
          ...columns,
          headerClassName: "header-style",
        }))}
        disableColumnMenu
        localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        pagination
        rows={rows}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
