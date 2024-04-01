import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DashboardLayout from "@/layouts/dashboard";
import { useEffect, useRef, useState } from "react";
import { cancelBL, getBL, getMX } from "@/api/mainApi";
import { MX } from "../MX";
import {
  GridColDef,
  GridRowSelectionModel,
  GridRowsProp,
} from "@mui/x-data-grid-premium";
import FetchTable from "@/components/fetch-table";
import CustomPopover from "@/components/popover";
import { enqueueSnackbar } from "@/components/snackbar";
import { useSettingsContext } from "@/components/settings";
import ReactToPrint from "react-to-print";
import QRCode from "react-qr-code";
import CloseIcon from "@mui/icons-material/Close";
import DialogForm from "@/components/dialog-form";
import MXTable from "./MXTable";

type BL = {
  id: number;
  batchCode: string;
  mxNumber: number;
  creatorName: string;
  status: number;
  createTime: string;
  recipeName: string;
  updateTime: string;
  machineCode: string;
  items: MX & { mxCode: string }[];
};

const defaultFilter = {
  batchCode: "",
  recipeName: "",
  status: "",
};
const statusMap: Record<string, string> = {
  "0": "待验收",
  "1": "待入库",
  "3": "已入库",
  "5": "已取消",
};

export default function BLPage() {
  const [filter, setFilter] = useState<Record<string, string>>(defaultFilter);
  const [rows, setRows] = useState<BL[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [selectedBL, setSelectedBL] = useState<BL[]>([]);
  const [newBL, setnewBL] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const mxRef = useRef<any>(null);

  useEffect(() => {
    setSelectedBL(
      rowSelectionModel.map((id) => rows.find((r) => r.id === id) as BL)
    );
  }, [rowSelectionModel, rows]);
  const onReset = () => {
    setFilter(defaultFilter);
    getBL().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
      }
    });
  };

  const query = () => {
    getBL(filter).then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      } else {
        enqueueSnackbar(res.data.msg, {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    });
  };

  const handleCancelBL = (id: number) => {
    cancelBL(id).then((res) => {
      if (res.data.code === 200) {
        query();
      } else {
        enqueueSnackbar(res.data.msg, {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    });
  };

  useEffect(() => {
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    {
      headerName: "批次号",
      field: "batchCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "MX吨包数",
      field: "mxNumber",
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
      field: "items",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueGetter: (params) => {
        return params.value.map((mx: any) => mx.mxCode).join(",");
      },
      renderCell: (params) => {
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
      headerName: "制定人员",
      field: "creatorName",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "状态",
      field: "status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueGetter: (params) => statusMap[params.value],
    },
    {
      headerName: "创建时间",
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
      headerName: "混拣机号",
      field: "machineCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
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
          <CustomPopover
            disabled={record.row.status !== 0}
            key="cancel"
            message={`您正在取消${record.row.batchCode}批次,确认取消吗?`}
            onOK={() => handleCancelBL(record.row.id)}
          />,
        ];
      },
    },
  ];
  const { themeStretch } = useSettingsContext();

  const renderBL = () => {};

  function renderPrintContent() {
    return (
      <>
        {selectedBL.map((bl) => (
          <Box key={bl.id} sx={{ py: 8 }}>
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
                {bl.recipeName}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">BL号：</Typography>
                {bl.batchCode}
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
                {bl.createTime}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <QRCode size={80} value={bl.batchCode} />
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
          BL批次管理
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            label="批次号"
            variant="outlined"
            size="small"
            value={filter.batchCode}
            onChange={(e) =>
              setFilter({ ...filter, batchCode: e.target.value })
            }
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
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            select
            label="配方状态"
            variant="outlined"
            size="small"
            fullWidth
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <MenuItem key="0" value="">
              选择配方状态
            </MenuItem>
            {Object.entries(statusMap).map((item) => (
              <MenuItem key={item[0]} value={item[0]}>
                {item[1]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}></Grid>
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
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
            customToobar={
              <>
                <Button onClick={() => setnewBL(true)}>生成BL</Button>
                <ReactToPrint
                  content={() => printRef.current}
                  trigger={() => (
                    <Button disabled={setSelectedBL.length == 0}>打印</Button>
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
      <Dialog
        fullWidth
        maxWidth="xl"
        open={newBL}
        onClose={() => setnewBL(false)}
      >
        <DialogTitle>生成BL</DialogTitle>
        <IconButton
          onClick={() => setnewBL(false)}
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
          <MXTable ref={mxRef} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={() => mxRef.current?.renderBL()}>
            确认
          </Button>
          <Button onClick={() => setnewBL(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

BLPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
