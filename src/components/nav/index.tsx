// next
import NextLink from "next/link";
import { NAV } from "@/config-global";
import {
  Box,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { StyledItem } from "./StyledItem";
import { NavItemProps } from "./type";
import useActiveLink from "@/hooks/useActiveLink";

const menuList = [
  {
    title: "配方管理",
    path: "/dashboard/formula",
  },
  {
    title: "MX批次管理",
    path: "/dashboard/MX",
  },
  {
    title: "BL批次管理",
    path: "/dashboard/BL",
  },
  {
    title: "在库管理",
    path: "/dashboard/stock",
  },
  {
    title: "出库管理",
    path: "/dashboard/removal",
  },
  {
    title: "操作日志",
    path: "/dashboard/log",
  },
  // {
  //   title: "配置中心",
  //   path: "/dashboard/setting",
  // },
];

function NavItem({ item, ...others }: NavItemProps) {
  const { active } = useActiveLink(item.path);
  const { title, path } = item;
  return (
    <Link component={NextLink} href={path} underline="none">
      <StyledItem active={active}>
        <ListItemText primary={title} />
      </StyledItem>
    </Link>
  );
}

export default function Nav() {
  const renderContent = (
    <Stack>
      <List disablePadding sx={{ px: 2 }}>
        {menuList.map((menu) => (
          <NavItem item={menu} key={menu.path} />
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
    </Stack>
  );
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            zIndex: 0,
            width: NAV.W_DASHBOARD,
            bgcolor: "transparent",
            borderRightStyle: "dashed",
          },
        }}
      >
        {renderContent}
      </Drawer>
    </Box>
  );
}
