import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { cancelStock, getStock } from "@/api/mainApi";
import { MX } from "../MX";
import DashboardLayout from "@/layouts/dashboard";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid-premium";
import FetchTable from "@/components/fetch-table";
import CustomPopover from "@/components/popover";
import { useSettingsContext } from "@/components/settings";
import QRCode from "react-qr-code";
import { format } from "date-fns";
import ReactToPrint from "react-to-print";

type Stock = {
  id: number;
  code: string;
  blCode: string;
  recipeName: string;
  binType: number;
  binCode: string;
  stockAge: number;
  mxs: MX[];
  createTime: string;
};

const binTypeMap = ["在途库区", "虚拟库区", "困料库区"];

const defaultFilter = {
  code: "",
  blCode: "",
  recipeName: "",
  binType: "",
  binCode: "",
};

export default function StockPage() {
  const [filter, setFilter] = useState<Record<string, string>>(defaultFilter);
  const [rows, setRows] = useState<Stock[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [selectedStock, setSelectedStock] = useState<Stock[]>([]);
  const { themeStretch } = useSettingsContext();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedStock(
      rowSelectionModel.map((id) => rows.find((r) => r.id === id) as Stock)
    );
  }, [rowSelectionModel, rows]);

  const query = () => {
    getStock(filter).then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  };

  const cancel = (id: string) => {
    cancelStock(id).then((res) => {
      if (res.data.code === 200) {
        query();
      }
    });
  };

  const onReset = () => {
    setFilter(defaultFilter);
    getStock().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      }
    });
  };

  useEffect(() => {
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      headerName: "库区类型",
      field: "binType",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
      valueGetter: (params) => binTypeMap[params.value],
    },
    {
      headerName: "库位编码",
      field: "binCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "库龄(天)",
      field: "stockAge",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "MX信息",
      field: "mxs",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
      valueGetter: (params) => {
        return params.value.map((mx: MX) => mx.batchCode).join(",");
      },
      renderCell: (params) => {
        console.log(params);
        return (
          <Stack direction="column" sx={{ py: 1 }}>
            {params.value.split(",").map((mx: string) => (
              <Typography key={mx}>{mx}</Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      headerName: "操作",
      field: "actions",
      headerAlign: "center",
      align: "center",
      flex: 1,
      type: "actions",
      getActions: (record) => {
        return [
          <>
            <CustomPopover
              disabled={record.row.binType != 0}
              title="取消入库"
              message="确认取消入库？"
              onOK={() => cancel(record.row.code)}
            />
          </>,
        ];
      },
    },
  ];
  function renderPrintContent() {
    return (
      <>
        {selectedStock.map((mx) => (
          <Box key={mx.id} sx={{ py: 8 }}>
            <Typography variant="h3" textAlign="center">
              混匀器泥料跟踪单
            </Typography>
            <Grid container spacing={2} sx={{ p: 4 }}>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">配方名：</Typography>
                {mx.recipeName}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">BL号：</Typography>
                {mx.blCode}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">棒密度：</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">操作者：</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">日&nbsp;&nbsp;&nbsp;期：</Typography>
                {mx.createTime}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <QRCode size={80} value={mx.blCode} />
              </Grid>
            </Grid>
          </Box>
        ))}
      </>
    );
  }
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Breadcrumbs>
        <Typography variant="h4" color="text.primary" gutterBottom>
          在库管理
        </Typography>
        =
      </Breadcrumbs>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField
            label="吨包号"
            size="small"
            value={filter.code}
            onChange={(e) => setFilter({ ...filter, code: e.target.value })}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="批次号"
            size="small"
            value={filter.blCode}
            onChange={(e) => setFilter({ ...filter, blCode: e.target.value })}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="配方名"
            size="small"
            value={filter.recipeName}
            onChange={(e) =>
              setFilter({ ...filter, recipeName: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            select
            label="库区类型"
            size="small"
            fullWidth
            value={filter.binType}
            onChange={(e) => setFilter({ ...filter, binType: e.target.value })}
          >
            <MenuItem key="-1" value="">
              选择配方状态
            </MenuItem>
            {binTypeMap.map((item, index) => (
              <MenuItem key={index} value={index}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="库位编码"
            size="small"
            value={filter.binCode}
            onChange={(e) => setFilter({ ...filter, binCode: e.target.value })}
          />
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
            checkboxSelection
            hasExport
            fileName="在库管理"
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            getRowHeight={() => "auto"}
            customToobar={
              <>
                <ReactToPrint
                  content={() => printRef.current}
                  trigger={() => (
                    <Button disabled={selectedStock.length == 0}>打印</Button>
                  )}
                />
              </>
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "none" }}>
        <div ref={printRef}>{renderPrintContent()}</div>
      </Box>
    </Container>
  );
}

StockPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
