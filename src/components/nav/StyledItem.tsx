// @mui
import { alpha, styled } from "@mui/material/styles";
import { ListItemButton } from "@mui/material";
import { NavItemProps } from "./type";
import { NAV } from "@/config-global";

type StyledItemProps = Omit<NavItemProps, "item"> & {
  caption?: boolean;
  disabled?: boolean;
};

export const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "caption",
})<StyledItemProps>(({ active, caption, theme }) => {
  const activeStyle = {
    color: theme.palette.primary.main,
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  };
  return {
    position: "relative",
    textTransform: "capitalize",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    height: NAV.H_DASHBOARD_ITEM,
    ...(active && {
      ...activeStyle,
      "&:hover": {
        ...activeStyle,
      },
    }),
  };
});
