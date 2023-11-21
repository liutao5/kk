import {
  Alert,
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
import DashboardLayout from "../layout";
import * as Yup from "yup";
import { Ref, RefObject, useEffect, useRef, useState } from "react";
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFInput from "@/components/hook-form/RHFInput";
import RHFSelect from "@/components/hook-form/RHFSelect";
import { Formula } from "../formula";
import { statusMap } from "..";
import FetchTable from "@/components/fetch-table";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid-premium";

export type MX = {
  id: number;
  batchCode: string;
  recipeName: string;
  status: number;
  createTime: string;
  updateTime: string;
  machineCode: string;
  creatorName: string;
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

export default function MXPage() {
  const [openMX, setOpenMX] = useState(false);
  const [formulaList, setFormulaList] = useState<Formula[]>([]);
  const [nextBatch, setNextBatch] = useState<string>("");
  const [nextBLBatch, setNextBLBatch] = useState("");

  const [openBL, setOpenBL] = useState(false);
  const [selectedMX, setSelectedMX] = useState<any>([]);

  const [rows, setRows] = useState<GridRowsProp>([]);

  const query = () => {
    getMX().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      }
    });
  };

  useEffect(() => {
    query();
  }, []);

  const queryFormula = () => {
    getFormula().then((res) => {
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
      }
    });
  };

  useEffect(() => console.log(selectedMX), [selectedMX]);

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
    number: 4,
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
      } else {
        reset();
        setError("afterSubmit", {
          message: res.data.msg,
        });
      }
    });
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

  const { handleSubmit: handleSubmitBL } = methodsBL;

  const onSubmitBL = (data: BL) => {
    console.log(data);
    const { creatorName } = data;
    addBL(
      creatorName,
      selectedMX.map((mx: MX) => mx.id)
    ).then((res) => console.log(res));
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
    },
    {
      headerName: "变更时间",
      field: "updateTime",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "混拣机号",
      field: "machineCode",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      headerName: "制定人员",
      field: "creatorName",
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
          <>
            {record.row.status === 0 && (
              <Button onClick={() => handleCancelMX(record.row.id)}>
                取消
              </Button>
            )}
          </>,
        ];
      },
    },
  ];
  return (
    <Container>
      <Breadcrumbs>
        <Typography color="text.primary">MX批次管理</Typography>
      </Breadcrumbs>
      <Divider />
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* <Grid item xs={3}>
          <TextField
            label="批次号"
            size="small"
            value={filter.batchCode}
            onChange={(e) =>
              setFilter((filter) => ({
                ...filter,
                batchCode: e.target.value,
              }))
            }
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="配方名"
            size="small"
            value={filter.recipeName}
            onChange={(e) =>
              setFilter((filter) => ({
                ...filter,
                recipeName: e.target.value,
              }))
            }
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            label="状态"
            size="small"
            fullWidth
            value={filter.status}
            onChange={(e) =>
              setFilter((filter) => ({
                ...filter,
                status: e.target.value,
              }))
            }
          >
            <MenuItem key="-1" value="">
              请选择
            </MenuItem>
            <MenuItem key="0" value="0">
              待使用
            </MenuItem>
            <MenuItem key="1" value="1">
              已使用
            </MenuItem>
            <MenuItem key="2" value="2">
              已取消
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Button onClick={onReset}>重置</Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" onClick={() => query()}>
            查询
          </Button>
        </Grid> */}
        <Grid item xs={1}>
          <Button onClick={() => setOpenMX(true)}>新建</Button>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => setOpenBL(true)}>生成BL</Button>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => setOpenBL(true)}>导出</Button>
        </Grid>
        <Grid item xs={12}>
          <FetchTable columns={columns} rows={rows} />
        </Grid>
      </Grid>
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
          <RHFSelect label="指定配方" name="recipeId" size="small">
            <MenuItem key="0" value={0}>
              请选择配方
            </MenuItem>
            {formulaList.map((formula) => (
              <MenuItem key={formula.id} value={formula.id}>
                {formula.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFInput label="MX吨包数" name="number" size="small" type="number" />
          <RHFInput label="混拣机号" name="machineCode" size="small" />
          <RHFInput label="制定人员" name="creatorName" size="small" />
        </Stack>
      </DialogForm>
      <DialogForm
        title="确认生成BL"
        methods={methodsBL}
        open={openBL}
        onClose={() => setOpenBL(false)}
        onSubmit={handleSubmitBL(onSubmitBL)}
      >
        <Stack spacing={2} sx={{ p: 1 }}>
          <div>{nextBLBatch}</div>
          {selectedMX.map((mx: MX) => (
            <div key={mx.id}>{mx.id}</div>
          ))}
          <RHFInput label="制定人员" name="creatorName" />
        </Stack>
      </DialogForm>
    </Container>
  );
}

MXPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
