import { useAuthContext } from "@/auth/useAuthContext";
import { HEADER, NAV } from "@/config-global";
import {
  AppBar,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { redirect } from "next/navigation";

export default function Header() {
  const { logout } = useAuthContext();
  const { palette } = useTheme();
  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: HEADER.H_DASHBOARD_DESKTOP,
        width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
        bgcolor: "background.default",
      }}
    >
      <Stack direction="row-reverse">
        <Button variant="text" onClick={() => logout()}>
          退出
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button variant="text">Admin</Button>
      </Stack>
    </AppBar>
  );
}
