// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// components
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  blog: icon("ic_blog"),
  cart: icon("ic_cart"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "",
    items: [
      {
        title: "配方管理",
        path: PATH_DASHBOARD.general.formula,
        icon: ICONS.dashboard,
      },
      {
        title: "MX批次管理",
        path: PATH_DASHBOARD.general.MX,
        icon: ICONS.ecommerce,
      },
      {
        title: "BL批次管理",
        path: PATH_DASHBOARD.general.BL,
        icon: ICONS.analytics,
      },
      {
        title: "在库管理",
        path: PATH_DASHBOARD.general.stock,
        icon: ICONS.banking,
      },
      {
        title: "出库单管理",
        path: PATH_DASHBOARD.general.removal,
        icon: ICONS.booking,
      },
      {
        title: "操作日志",
        path: PATH_DASHBOARD.general.log,
        icon: ICONS.file,
      },
      {
        title: "库存统计报表",
        path: PATH_DASHBOARD.general.record,
        icon: ICONS.booking,
      },
    ],
  },
];

export default navConfig;
