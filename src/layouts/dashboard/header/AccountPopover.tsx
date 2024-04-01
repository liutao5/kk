import { useEffect, useState } from "react";
// next
import { useRouter } from "next/router";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Drawer,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
// routes
import { PATH_DASHBOARD, PATH_AUTH } from "../../../routes/paths";
// auth
import { useAuthContext } from "../../../auth/useAuthContext";
// components
import { CustomAvatar } from "../../../components/custom-avatar";
import { useSnackbar } from "../../../components/snackbar";
import MenuPopover from "../../../components/menu-popover";
import { IconButtonAnimate } from "../../../components/animate";
import { Draw } from "@mui/icons-material";
import { getConfig, updateConfig } from "@/api/mainApi";

// ----------------------------------------------------------------------

const OPTIONS = [
  // {
  //   label: "Home",
  //   linkTo: "/",
  // },
  // {
  //   label: "Profile",
  //   linkTo: PATH_DASHBOARD.user.profile,
  // },
  {
    label: "设置",
    linkTo: PATH_DASHBOARD.general.setting,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { replace, push } = useRouter();

  const { logout } = useAuthContext();
  const [open, setOpen] = useState(false);

  const user = {
    displayName: "Admin",
    photoURL: "",
  };

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const [forceFifo, setForceFifo] = useState<string>("");

  useEffect(() => {
    getConfig().then((res) => {
      if (res.data.code === 200) {
        setForceFifo(res.data.data.forceFifo);
      }
    });
  }, []);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      replace(PATH_AUTH.root);
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  const handleSetting = () => {
    handleClosePopover();
    setOpen(true);
  };

  const handleChangeFifo = (value: string) => {
    setForceFifo(value);
    updateConfig(value).then((res) => console.log(res));
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar
          src={user?.photoURL}
          alt={user?.displayName}
          name={user?.displayName}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        sx={{ width: 200, p: 0 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography> */}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => ( */}
        <MenuItem onClick={() => handleSetting()} sx={{ m: 1 }}>
          设置
        </MenuItem>
        {/* ))}
        </Stack> */}

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          退出
        </MenuItem>
      </MenuPopover>
      <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 480,
            height: "100%",
            display: "flex",
            alignItems: "center",
            px: 8,
          }}
        >
          <FormControl>
            <FormLabel>是否强制按照BL先进先出</FormLabel>
            <RadioGroup
              value={forceFifo}
              onChange={(event) => handleChangeFifo(event.target.value)}
            >
              <FormControlLabel label="是" value="true" control={<Radio />} />
              <FormControlLabel label="否" value="false" control={<Radio />} />
            </RadioGroup>
          </FormControl>
        </Box>
      </Drawer>
    </>
  );
}
