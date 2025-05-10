import { getRecord } from "@/api/mainApi";
import FetchTable from "@/components/fetch-table";
import { useSettingsContext } from "@/components/settings";
import DashboardLayout from "@/layouts/dashboard";
import {
  Breadcrumbs,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { GridColDef } from "@mui/x-data-grid-premium";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { format } from "date-fns";
import { useEffect, useState } from "react";

type Log = {
  operId: number;
  operTime: string;
  title: string;
  operParam: string;
  operName: string;
  operIp: string;
};

const defaultFilter = {
  title: "",
  operName: "",
  backStock: "",
  reason: "",
};

const backStockMap = [
  { label: "是", value: "true" },
  { label: "否", value: "false" },
];

const reasonkMap = [
  { label: "出库", value: "出库" },
  { label: "入库", value: "入库" },
];

export default function LogPage() {
  const [filter, setFilter] = useState<Record<string, any>>(defaultFilter);
  const [rows, setRows] = useState<Log[]>([]);
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const query = () => {
    getRecord({
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
    getRecord().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  };

  useEffect(() => {
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => console.log("filter", filter), [filter]);

  const columns: GridColDef[] = [
    {
      headerName: "吨包号",
      field: "code",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
    },
    {
      headerName: "批次号",
      field: "blCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "配方名",
      field: "recipeName",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "MX信息",
      field: "mxInfo",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="column" sx={{ py: 1 }}>
            {params.value.split(";").map((mx: string) => (
              <Typography key={mx}>{mx}</Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      headerName: "MX吨数（Kg）",
      field: "mxWeight",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
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
      headerName: "库存变动（Kg）",
      field: "changeNumber",
      align: "center",
    },
    {
      headerName: "生成原因",
      field: "reason",
      align: "center",
    },
    {
      headerName: "生成时间",
      field: "createTime",
      align: "center",

      // valueGetter: (params) => format(params.value, 'YYYY-MM-DD HH:mm:SS'),
    },
    {
      headerName: "返料入库",
      field: "backStock",
      align: "center",
      valueGetter: (params) => (params.value ? "是" : "否"),
    },
    {
      headerName: "关联单号",
      field: "orderCode",
      align: "center",
    },
  ];
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Breadcrumbs>
        <Typography variant="h4" color="text.primary" gutterBottom>
          库存统计报表
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField
            sx={{ flex: 1 }}
            label="吨包号"
            size="small"
            fullWidth
            value={filter.code}
            onChange={(e) => setFilter({ ...filter, code: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.code && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, code: "" })}
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
            size="small"
            fullWidth
            value={filter.recipeName}
            onChange={(e) =>
              setFilter({ ...filter, recipeName: e.target.value })
            }
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
            label="生成原因"
            size="small"
            fullWidth
            value={filter.reason}
            onChange={(e) => setFilter({ ...filter, reason: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.reason && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, reason: "" })}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem key="0" value="">
              选择生成原因
            </MenuItem>
            {reasonkMap.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <DateRangePicker
            label="生成日期"
            sx={{ width: "240px" }}
            value={dateValue}
            slots={{ field: SingleInputDateRangeField }}
            slotProps={{ textField: { size: "small" } }}
            onChange={(dataList) => setDateValue(dataList)}
            format="yyyy/MM/dd"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            select
            label="是否是返料"
            size="small"
            fullWidth
            value={filter.backStock}
            onChange={(e) =>
              setFilter({ ...filter, backStock: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.backStock && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, backStock: "" })}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem key="0" value="">
              选择是否是返料
            </MenuItem>
            {backStockMap.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
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
            getRowHeight={() => "auto"}
            hasExport
            fileName="库存统计报表"
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </Container>
  );
}

LogPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
