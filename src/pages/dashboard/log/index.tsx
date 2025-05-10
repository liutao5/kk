import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/dashboard";
import { getLog } from "@/api/mainApi";
import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { GridColDef } from "@mui/x-data-grid-premium";
import FetchTable from "@/components/fetch-table";
import { format } from "date-fns";
import { useSettingsContext } from "@/components/settings";

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
};

export default function LogPage() {
  const [filter, setFilter] = useState<Record<string, string>>(defaultFilter);
  const [rows, setRows] = useState<Log[]>([]);
  const [dateValue, setDateValue] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const query = () => {
    getLog({
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
    getLog().then((res) => {
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

  const columns: GridColDef[] = [
    {
      headerName: "操作时间",
      field: "operTime",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "操作功能",
      field: "title",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "请求参数",
      field: "operParam",
      headerAlign: "center",
      align: "center",
      width: 350,
    },
    {
      headerName: "操作人",
      field: "operName",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },

    {
      headerName: "IP地址",
      field: "operIp",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Breadcrumbs>
        <Typography variant="h4" color="text.primary" gutterBottom>
          操作日志
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField
            label="操作功能"
            size="small"
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.title && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, title: "" })}
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
            label="操作人"
            size="small"
            value={filter.operName}
            onChange={(e) => setFilter({ ...filter, operName: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.operName && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, operName: "" })}
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <DateRangePicker
            label="操作日期"
            sx={{ width: "280px" }}
            value={dateValue}
            slots={{ field: SingleInputDateRangeField }}
            slotProps={{ textField: { size: "small" } }}
            onChange={(dataList) => setDateValue(dataList)}
            format="yyyy/MM/dd"
          />
        </Grid>
        <Grid item xs={3}></Grid>
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
            getRowId={(row) => row.operId}
            columns={columns}
            rows={rows}
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
