import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DashboardLayout from "@/layouts/dashboard";
import * as Yup from "yup";
import {
  forwardRef,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import { Formula } from "../formula";
import { statusMap } from "..";
import FetchTable from "@/components/fetch-table";
import {
  GridColDef,
  GridRowSelectionModel,
  GridRowsProp,
  useGridApiRef,
} from "@mui/x-data-grid-premium";
import { useSnackbar } from "@/components/snackbar";
import { useSettingsContext } from "@/components/settings";

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

type Props = {
  onFinish: VoidFunction;
};

const MXTable = forwardRef(function MXTable(props: Props, ref) {
  const { onFinish } = props;
  const [filter, setFilter] = useState<Record<string, string>>(defaultFilter);
  const [rows, setRows] = useState<GridRowsProp>([]);

  const [formulaList, setFormulaList] = useState<Formula[]>([]);
  const [nextBatch, setNextBatch] = useState<string>("");
  const [nextBLBatch, setNextBLBatch] = useState("");

  const [openBL, setOpenBL] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [selectedMX, setSelectedMX] = useState<MX[]>([]);

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
      rowSelectionModel.map((id) => rows.find((r) => r.id === id) as MX)
    );
  }, [rowSelectionModel, rows]);

  useEffect(() => {
    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    queryFormula();
    queryNextBatch();
    queryNextBLBatch();
  }, []);

  const renderBL = useCallback(() => {
    console.log(rowSelectionModel);
    if (rowSelectionModel.length === 0) {
      enqueueSnackbar("请选择MX批次", {
        autoHideDuration: 2000,
        variant: "error",
      });
      return;
    }
    setOpenBL(true);
  }, [rowSelectionModel]);

  useImperativeHandle(
    ref,
    () => ({
      renderBL: renderBL,
    }),
    [renderBL]
  );

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
    addBL(
      creatorName,
      rowSelectionModel.map((mx) => Number(mx))
    ).then((res) => {
      if (res.data.code === 200) {
        query();
        closeBL();
        setRowSelectionModel([]);
        onFinish();
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
  ];
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Grid container spacing={2}>
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
            customToobar={<>MX列表</>}
          />
        </Grid>
      </Grid>
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
                <Stack direction="row">
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
    </Container>
  );
});
export default MXTable;
