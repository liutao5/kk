import {
  addBL,
  addMX,
  cancelMX,
  getFormula,
  getMX,
  getNextBLBatch,
  getNextBatch,
} from "@/api/mainApi";
import DialogForm from "@/components/dialog-form";
import FetchTable from "@/components/fetch-table";
import RHFAutocomplete from "@/components/hook-form/RHFAutocomplete";
import RHFInput from "@/components/hook-form/RHFInput";
import CustomPopover from "@/components/popover";
import { useSettingsContext } from "@/components/settings";
import { useSnackbar } from "@/components/snackbar";
import DashboardLayout from "@/layouts/dashboard";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {
  GridColDef,
  GridRowSelectionModel,
  GridRowsProp
} from "@mui/x-data-grid-premium";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import { statusMap } from "..";
import { Formula } from "../formula";
import WeightDialog from "./WeightDialog";

export type MX = {
  id: number;
  batchCode: string;
  recipeId: number;
  recipeName: string;
  status: number;
  createTime: string;
  updateTime: string;
  machineCode: string;
  creatorName: string;
  weight?: number;
};

type MXForm = Omit<
  MX,
  "id" | "batchCode" | "recipeName" | "createTime" | "updateTime" | "status"
> & {
  recipeId: number;
  remark?: string;
  number: number;
  afterSubmit?: string;
};

type BL = {
  creatorName: string;
  mxIds?: number[];
};

const defaultFilter = {
  batchCode: "",
  recipeName: "",
  status: "",
};

export default function MXPage() {
  const [filter, setFilter] = useState<Record<string, string>>(defaultFilter);
  const [rows, setRows] = useState<GridRowsProp>([]);

  const [openMX, setOpenMX] = useState(false);
  const [formulaList, setFormulaList] = useState<Formula[]>([]);
  const [nextBatch, setNextBatch] = useState<string>("");
  const [nextBLBatch, setNextBLBatch] = useState("");

  const [openBL, setOpenBL] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [selectedMX, setSelectedMX] = useState<MX[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const [openWeight, setOpenWeight] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar();

  const query = () => {
    getMX(filter).then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      }
    });
  };

  const onReset = () => {
    setFilter(defaultFilter);
    getMX().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      }
    });
  };

  useEffect(() => {
    setSelectedMX(
      rowSelectionModel.map((batchCode) => rows.find((r) => r.batchCode === batchCode) as MX)
    );
  }, [rowSelectionModel, rows]);

  useEffect(() => {
    query();
  }, []);

  const queryFormula = () => {
    getFormula({ enable: true }).then((res) => {
      if (res.data.code === 200) {
        setFormulaList(res.data.data);
      } else {
        console.log(res.data);
      }
    });
  };

  const queryNextBatch = () => {
    getNextBatch().then((res) => {
      if (res.data.code === 200) {
        setNextBatch(res.data.msg);
      }
    });
  };

  const queryNextBLBatch = () => {
    getNextBLBatch().then((res) => {
      if (res.data.code === 200) {
        setNextBLBatch(res.data.msg);
      }
    });
  };

  const handleCancelMX = (id: number) => {
    cancelMX(id).then((res) => {
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
    queryFormula();
    queryNextBatch();
    queryNextBLBatch();
  }, []);

  const MXSchema = Yup.object().shape({
    recipeId: Yup.number().required("请选择配方").min(1, "请选择配方"),
    number: Yup.number().required("请选择吨包数"),
    machineCode: Yup.string().required("请输入混拣机号"),
    creatorName: Yup.string().required("请输入制定人员"),
  });

  const defaultValues: MXForm = {
    machineCode: "",
    creatorName: "",
    recipeId: 0,
    remark: "",
    number: 1,
  };

  const methods = useForm<MXForm>({
    resolver: yupResolver(MXSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = (data: MXForm) => {
    addMX(data).then((res) => {
      if (res.data.code === 200) {
        queryNextBatch();
        setOpenMX(false);
        query();
        reset();
      } else {
        reset();
        setError("afterSubmit", {
          message: res.data.msg,
        });
      }
    });
  };

  const renderBL = () => {
    if (rowSelectionModel.length === 0) {
      enqueueSnackbar("请选择MX批次", {
        autoHideDuration: 2000,
        variant: "error",
      });
      return;
    }
    setOpenBL(true);
  };

  const BLSchema = Yup.object().shape({
    creatorName: Yup.string().required("请输入制定人员"),
  });

  const defaultBLValues = {
    creatorName: "",
  };

  const methodsBL = useForm<BL>({
    resolver: yupResolver(BLSchema),
    defaultValues: defaultBLValues,
  });

  const { handleSubmit: handleSubmitBL, reset: resetBL } = methodsBL;

  const closeBL = () => {
    setOpenBL(false);
    resetBL();
  };

  const onSubmitBL = (data: BL) => {
    const { creatorName } = data;
    console.log('rowSelectionModel', rowSelectionModel, selectedMX)
    addBL(
      creatorName,
      selectedMX.map((mx) => Number(mx.id))
    ).then((res) => {
      if (res.data.code === 200) {
        query();
        closeBL();
        setRowSelectionModel([]);
      } else {
        enqueueSnackbar(res.data.msg, {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    });
  };

  const columns: GridColDef[] = [
    {
      headerName: "批次号",
      field: "batchCode",
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
      headerName: "重量（Kg）",
      field: "weight",
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
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      headerName: "变更时间",
      field: "updateTime",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 200,
      sortable: false,
    },
    {
      headerName: "混拣机号",
      field: "machineCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
    },
    {
      headerName: "制定人员",
      field: "creatorName",
      headerAlign: "center",
      align: "center",
      flex: 1,
      sortable: false,
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
              disabled={record.row.status !== 0}
              message={`您正在取消${record.row.batchCode}批次,确认取消吗?`}
              onOK={() => handleCancelMX(record.row.id)}
              title="取消"
            />
          </>,
        ];
      },
    },
  ];
  const { themeStretch } = useSettingsContext();
  function renderPrintContent() {
    return (
      <>
        {selectedMX.map((mx) => (
          <Box key={mx.id} sx={{ py: 8 }}>
            <Typography variant="h3" textAlign="center">
              搅拌机泥料跟踪单
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
                <Typography variant="h6">MX号：</Typography>
                {mx.batchCode}
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", direction: "row", alignItems: "center" }}
              >
                <Typography variant="h6">日&nbsp;&nbsp;&nbsp;期：</Typography>
                {format(new Date(mx.createTime), "yyyy-MM-dd HH:mm:ss")}
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
                <QRCode size={80} value={mx.batchCode} />
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
          MX批次管理
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
            label="状态"
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
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            rows={rows}
            getRowId={rows => rows.batchCode}
            customToobar={
              <>
                <Button onClick={() => setOpenMX(true)}>新建</Button>
                <Button disabled={selectedMX.length == 0} onClick={renderBL}>
                  生成BL
                </Button>
                <ReactToPrint
                  content={() => printRef.current}
                  trigger={() => (
                    <Button disabled={selectedMX.length == 0}>打印</Button>
                  )}
                />
                <Button disabled={selectedMX.length == 0} onClick={() => setOpenWeight(true)}>登记重量</Button>
              </>
            }
            hasExport={true}
            fileName='MX批次信息'
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "none" }}>
        <div ref={printRef}>{renderPrintContent()}</div>
      </Box>
      <DialogForm
        title="新建MX批次"
        methods={methods}
        open={openMX}
        onClose={() => setOpenMX(false)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2} sx={{ p: 1 }}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          <TextField
            label="拟起始批次号"
            name="batchCode"
            value={nextBatch}
            size="small"
          />
          <RHFAutocomplete
            label="指定配方"
            name="recipeId"
            options={formulaList.map((item) => item.id)}
            getOptionLabel={(id: string | number) =>
              formulaList.find((item) => item.id === id)?.name || ""
            }
            size="small"
          />
          <RHFInput label="MX吨包数" name="number" size="small" type="number" />
          <RHFInput label="混拣机号" name="machineCode" size="small" />
          <RHFInput label="制定人员" name="creatorName" size="small" />
        </Stack>
      </DialogForm>
      <DialogForm
        title="确认生成BL"
        methods={methodsBL}
        open={openBL}
        onClose={closeBL}
        onSubmit={handleSubmitBL(onSubmitBL)}
      >
        <Stack spacing={2} sx={{ p: 1 }}>
          <Typography>{nextBLBatch}</Typography>
          {[...new Set(selectedMX.map((mx: MX) => mx.recipeId))].map((item) => {
            const filterItem = selectedMX.filter(
              (allmx) => allmx.recipeId === item
            );
            return (
              <Card key={item} sx={{ p: 2 }}>
                <Typography>{filterItem[0].recipeName}</Typography>
                <Stack direction="row" flexWrap="wrap">
                  {filterItem.map((f) => (
                    <Button key={f.id}>{f.batchCode}</Button>
                  ))}
                </Stack>
              </Card>
            );
          })}
          {[...new Set(selectedMX.map((mx: MX) => mx.recipeId))].length > 1 && (
            <Alert severity="error">所选MX的配方不一致，请核对修正！</Alert>
          )}
          <RHFInput label="制定人员" name="creatorName" />
        </Stack>
      </DialogForm>
      <WeightDialog open={openWeight} onClose={() => {setOpenWeight(false);query()}} selectedMX={selectedMX} />
    </Container>
  );
}

MXPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
