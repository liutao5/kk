import { HEADER, NAV } from "@/config-global";
import { ChildrenParams } from "@/types/common";
import { Box } from "@mui/material";

const SPACING = 8;

export default function Main({ children }: ChildrenParams) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        px: 2,
        py: `${HEADER.H_DASHBOARD_DESKTOP + SPACING}px`,
        width: `calc(100% - ${NAV.W_DASHBOARD}px)`,
      }}
    >
      {children}
    </Box>
  );
}
