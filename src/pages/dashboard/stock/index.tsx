import { cancelStock, getStock } from "@/api/mainApi";
import FetchTable from "@/components/fetch-table";
import CustomPopover from "@/components/popover";
import { useSettingsContext } from "@/components/settings";
import DashboardLayout from "@/layouts/dashboard";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
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
import { GridColDef, GridExceljsProcessInput, GridRowSelectionModel } from "@mui/x-data-grid-premium";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import ReactToPrint from "react-to-print";
import { MX } from "../MX";
import WeightDialog from "./WeightDialog";

export type Stock = {
  id: number;
  code: string;
  blCode: string;
  recipeName: string;
  binType: number;
  binCode: string;
  stockAge: number;
  mxs: string[];
  mxWeights: string[];
  createTime: string;
  weight?: number;
};

const binTypeMap = ["在途库区", "虚拟库区", "困料库区"];

const backStockMap = [
  { label: "是", value: "true" },
  { label: "否", value: "false" },
];

const defaultFilter = {
  code: "",
  blCode: "",
  recipeName: "",
  binType: "",
  binCode: "",
  backStock: "",
};


function exceljsPostProcess({ workbook, worksheet }: GridExceljsProcessInput) {
  const insertValues: Array<[number, any]> = []
  const mergeList: [number,number][] = []
  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const mxsValues = (row.getCell(8).value as string).split(',')
    const weightValues = (row.getCell(9).value as string).split(',')
    mergeList.push([rowIndex, mxsValues.length])
    if (mxsValues.length > 1) {
      row.getCell(8).value = mxsValues[0]
      row.getCell(9).value = Number(weightValues[0])
    }
    for (let i=1; i<mxsValues.length;i++) {
      const rowValue = [...(row.values as any[])]
      rowValue[8] = mxsValues[i]
      rowValue[9] = Number(weightValues[i])
      insertValues.push([rowIndex, rowValue.splice(1)])

    }
  })
  let index = 1
  insertValues.forEach(([rowIndex, values]) => {
    worksheet.insertRow(rowIndex+index, values)
    index = index+1
  })
  const cols = ['A','B','C','D', 'E','F','G','J']
  cols.forEach(letter => {
    let mergeCount = 0
    mergeList.forEach(([start, count]) => {
        worksheet.mergeCells(`${letter}${start+mergeCount}:${letter}${start+mergeCount+count-1}`);
        mergeCount = mergeCount + count -1
    })
  })
}

export default function StockPage() {
  const [filter, setFilter] = useState<Record<string, any>>(defaultFilter);
  const [rows, setRows] = useState<Stock[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [selectedStock, setSelectedStock] = useState<Stock[]>([]);
  const { themeStretch } = useSettingsContext();
  const printRef = useRef<HTMLDivElement>(null);

  const [openWeight, setOpenWeight] = useState<boolean>(false);

  useEffect(() => {
    setSelectedStock(
      rowSelectionModel.map(
        (code) => rows.find((r) => r.code === code) as Stock
      )
    );
  }, [rowSelectionModel, rows]);

  const query = () => {
    setRowSelectionModel([]);
    getStock(filter).then((res) => {
      if (res.data.code === 200) {
        setRows(
          res.data.data.map((item: any) => ({
            ...item,
            mxs: item.mxs.map((mx: MX) => mx.batchCode).join(","),
            mxWeights: item.mxs.map((mx: MX) => mx.weight).join(","),
          }))
        );
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
    setRowSelectionModel([]);
    getStock().then((res) => {
      if (res.data.code === 200) {
        setRows(
          res.data.data.map((item: any) => ({
            ...item,
            mxs: item.mxs.map((mx: MX) => mx.batchCode).join(","),
            mxWeights: item.mxs.map((mx: MX) => mx.weight).join(","),
          }))
        );
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
      headerName: "吨包重量（Kg）",
      field: "weight",
      align: "center",
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
      renderCell: (params) => {
        return (
          <Stack direction="column" sx={{ py: 1 }}>
            {params.value?.split(",").map((mx: string) => (
              <Typography key={mx}>{mx}</Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      headerName: "MX重量（Kg）",
      field: "mxWeights",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,

      renderCell: (params) => {
        return (
          <Stack direction="column" sx={{ py: 1 }}>
            {params.value.split(",").map((mx: string, index: number) => (
              <Typography key={index}>{mx}</Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      headerName: "返料入库",
      field: "backStock",
      align: "center",
      valueGetter: (params) => (params.value ? "是" : "否"),
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
      </Breadcrumbs>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField
            sx={{ flex: 1 }}
            label="吨包号"
            size="small"
            value={filter.code}
            onChange={(e) => setFilter({ ...filter, code: e.target.value })}
            fullWidth
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
            label="批次号"
            size="small"
            fullWidth
            value={filter.blCode}
            onChange={(e) => setFilter({ ...filter, blCode: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.blCode && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, blCode: "" })}
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
            label="库区类型"
            size="small"
            fullWidth
            value={filter.binType}
            onChange={(e) => setFilter({ ...filter, binType: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.binType !== undefined && filter.binType !== "" && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        setFilter({ ...filter, binType: undefined })
                      }
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem key="-1" value={undefined}>
              选择配方状态
            </MenuItem>
            {binTypeMap.map((item, index) => (
              <MenuItem key={index} value={index}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={1}>
          <TextField
            label="库位编码"
            size="small"
            value={filter.binCode}
            onChange={(e) => setFilter({ ...filter, binCode: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.binCode && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, binCode: "" })}
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
                      onClick={() =>
                        setFilter({ ...filter, backStock: undefined })
                      }
                    >
                      <CancelIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          >
            <MenuItem key="-1" value="">
              选择是否是返料
            </MenuItem>
            {backStockMap.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={1}>
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
            getRowId={(rows) => rows.code}
            checkboxSelection
            hasExport
            fileName="库存信息"
            exceljsPostProcess={exceljsPostProcess}
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
                <Button
                  disabled={selectedStock.length == 0}
                  onClick={() => setOpenWeight(true)}
                >
                  登记重量
                </Button>
              </>
            }
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "none" }}>
        <div ref={printRef}>{renderPrintContent()}</div>
      </Box>
      <WeightDialog
        open={openWeight}
        onClose={() => {
          setOpenWeight(false);
          query();
        }}
        selectedStock={selectedStock}
      />
    </Container>
  );
}

StockPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
