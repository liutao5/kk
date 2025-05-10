import { cancelRemoval, getRemoval } from "@/api/mainApi";
import FetchTable from "@/components/fetch-table";
import CustomPopover from "@/components/popover";
import { useSettingsContext } from "@/components/settings";
import { enqueueSnackbar } from "@/components/snackbar";
import DashboardLayout from "@/layouts/dashboard";
import CloseIcon from "@mui/icons-material/Close";
import {
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DataGridPremium, GridColDef } from "@mui/x-data-grid-premium";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Removal = {
  id: number;
  orderCode: string;
  status: number;
  creatorName: string;
  type: number;
  createTime: string;
  updateTime: string;
  remark?: string;
  items?: Detail[];
};

type Detail = {
  recipeName: string;
  totalNumber: string;
  remark?: string;
};

const removalStatusMap: Record<string, string> = {
  0: "待出库",
  2: "出库中",
  3: "已出库",
  5: "已取消",
};

const typeMap: Record<string, string> = {
  0: "标准出库",
};

const defaultFilter = {
  orderCode: "",
  recipeName: "",
  status: "",
};

export default function RemovalPage() {
  const { push } = useRouter();
  const [filter, setFilter] = useState<Record<string, any>>(defaultFilter);
  const [rows, setRows] = useState<Removal[]>([]);
  const [detail, showDetail] = useState<Removal>();
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const query = () => {
    getRemoval({
      ...filter,
      fromTime:
        dateValue[0] && format(dateValue[0] ?? 0, "yyyy-MM-dd 00:00:00"),
      toTime: dateValue[1] && format(dateValue[1] ?? 0, "yyyy-MM-dd 00:00:00"),
    }).then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  };

  const onReset = () => {
    setFilter(defaultFilter);
    setDateValue([null, null]);
    getRemoval().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  };

  const handleCancel = (id: number) => {
    cancelRemoval(id).then((res) => {
      if (res.data.code === 200) {
        getRemoval().then((res) => {
          if (res.data.code === 200) {
            setRows(res.data.data);
          } else {
            enqueueSnackbar(res.data.msg, {
              autoHideDuration: 2000,
              variant: "error",
            });
          }
        });
      } else {
        enqueueSnackbar(res.data.msg, {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    });
  };

  useEffect(() => {
    getRemoval().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  }, []);

  const columns: GridColDef[] = [
    {
      headerName: "出库单",
      field: "orderCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "配方名",
      field: "recipeNamesString",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction="column" sx={{ py: 1 }}>
            {params.value.split(";").map((mx: string, index: number) => (
              <Typography key={index}>{mx}</Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      headerName: "状态",
      field: "status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueGetter: (params) => removalStatusMap[params.value],
    },
    {
      headerName: "申请人",
      field: "creatorName",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "单据类型",
      field: "type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueGetter: (params) => typeMap[params.value],
    },
    {
      headerName: "申请时间",
      field: "createTime",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      headerName: "变更时间",
      field: "updateTime",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      headerName: "操作",
      field: "actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      type: "actions",
      getActions: (record) => {
        console.log(record.row);
        return [
          <>
            <Button onClick={() => showDetail(record.row)}>详情</Button>
            <CustomPopover
              disabled={record.row.status != 0 && record.row.status != 2}
              message={`您正在取消${record.row.orderCode}出库单,确认取消吗?`}
              onOK={() => handleCancel(record.row.id)}
            />
          </>,
        ];
      },
    },
  ];
  const { themeStretch } = useSettingsContext();
  const DetailColumns: GridColDef[] = [
    {
      headerName: "配方名",
      field: "recipeName",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "申请量",
      field: "totalNumber",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "备注",
      field: "remark",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Breadcrumbs>
        <Typography variant="h4" color="text.primary" gutterBottom>
          出库管理
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField
            label="出库单号"
            variant="outlined"
            size="small"
            value={filter.orderCode}
            onChange={(e) =>
              setFilter({ ...filter, orderCode: e.target.value })
            }
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.orderCode && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, orderCode: "" })}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="配方名"
            variant="outlined"
            size="small"
            value={filter.recipeName}
            onChange={(e) =>
              setFilter({ ...filter, recipeName: e.target.value })
            }
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.recipeName && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, recipeName: "" })}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            select
            label="状态"
            variant="outlined"
            size="small"
            fullWidth
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.status && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        setFilter({ ...filter, status: undefined })
                      }
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem key="0" value="">
              选择状态
            </MenuItem>
            {Object.entries(removalStatusMap).map((item) => (
              <MenuItem key={item[0]} value={item[0]}>
                {item[1]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <DateRangePicker
            label="申请日期"
            sx={{ width: "280px" }}
            value={dateValue}
            slots={{ field: SingleInputDateRangeField }}
            slotProps={{
              textField: {
                size: "small",
                inputProps: {
                  endAdornment: (
                    <InputAdornment position="start">
                      {
                        <IconButton
                          size="small"
                          onClick={() => setDateValue([null, null])}
                        >
                          <CancelIcon />
                        </IconButton>
                      }
                    </InputAdornment>
                  ),
                },
              },
            }}
            onChange={(dataList) => setDateValue(dataList)}
            format="yyyy/MM/dd"
          />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={onReset}>
              重置
            </Button>
            <Button variant="contained" onClick={() => query()}>
              查询
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <FetchTable
            columns={columns}
            rows={rows}
            customToobar={
              <Button
                variant="text"
                onClick={() => push("/dashboard/removal/new")}
              >
                新增
              </Button>
            }
            checkboxSelection
            disableRowSelectionOnClick
            hasExport={true}
            fileName="出库信息"
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={!!detail}
        onClose={() => showDetail(undefined)}
      >
        <DialogTitle>出库单详情</DialogTitle>
        <IconButton
          onClick={() => showDetail(undefined)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">基础信息</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="出库单号"
                value={detail?.orderCode}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="申请人"
                value={detail?.creatorName}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField label="单据类型" value="标准出库" size="small" />
            </Grid>
            <Grid item xs={6}>
              <TextField label="备注" value={detail?.remark} size="small" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">详细信息</Typography>
            </Grid>
            <Grid item xs={12}>
              <DataGridPremium
                columns={DetailColumns}
                rows={detail?.items || []}
                hideFooter={true}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => showDetail(undefined)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

RemovalPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
