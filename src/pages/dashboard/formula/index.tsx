import {
  addFormula,
  getFormula,
  removeFormula,
  updateFormula,
  updateFormulaStatus,
} from "@/api/mainApi";
import {
  Alert,
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
import { Table } from "antd";
import * as Yup from "yup";
import { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "../layout";
import RHFInput from "@/components/hook-form/RHFInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogForm from "@/components/dialog-form";
import FetchTable from "@/components/fetch-table";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid-premium";

export type Formula = {
  id: number;
  code: string;
  name: string;
  enable: boolean; // 状态
};

type FormulaProps = {
  name: string;
  code: string;
  afterSubmit?: string;
};

export default function FormulaPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Record<string, string>>({
    name: "",
    enable: "",
  });

  const [open2, setOpen2] = useState(false);
  const [editFormula, setEditFormula] = useState<Formula>();
  const [rows, setRows] = useState<GridRowsProp>([]);

  const query = () => {
    getFormula().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      }
    });
  };

  useEffect(() => {
    query();
  }, []);

  useEffect(() => setOpen2(!!editFormula), [editFormula]);

  const update = (id: number, enable: boolean) => {
    updateFormulaStatus(id, enable).then((res) => {
      if (res.data.code === 200) {
        query();
      }
    });
  };

  const remove = (id: number) => {
    removeFormula(id).then((res) => {
      if (res.data.code === 200) {
        query();
      }
    });
  };

  const FormulaSchema = Yup.object().shape({
    name: Yup.string().required("请输入配方名称"),
    code: Yup.string().required("请输入配方码"),
  });

  const defaultValues = {
    name: "",
    code: "",
  };

  const methods = useForm<FormulaProps>({
    resolver: yupResolver(FormulaSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  const onClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: FormulaProps) => {
    const { name, code } = data;
    addFormula(name, code).then((res) => {
      if (res.data.code === 200) {
        onClose();
        query();
      } else {
        reset();
        setError("afterSubmit", {
          message: res.data.msg,
        });
      }
    });
  };

  const FormulaSchema2 = Yup.object().shape({
    name: Yup.string().required("请输入配方名称"),
  });

  const methods2 = useForm<Omit<FormulaProps, "code">>({
    resolver: yupResolver(FormulaSchema2),
    defaultValues,
  });

  const {
    handleSubmit: handleSubmit2,
    reset: reset2,
    setError: setError2,
    formState: { errors: errors2 },
  } = methods2;

  const onClose2 = () => {
    reset2();
    setEditFormula(undefined);
  };

  const onSubmit2 = async (data: Omit<FormulaProps, "code">) => {
    const { name } = data;
    if (editFormula) {
      updateFormula(editFormula.id, name).then((res) => {
        if (res.data.code === 200) {
          onClose2();
          query();
        } else {
          reset();
          setError("afterSubmit", {
            message: res.data.msg,
          });
        }
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "序号",
      width: 50,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "code",
      headerName: "配方号",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "name",
      headerName: "配方名称",
      flex: 2,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "enable",
      headerName: "状态",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      valueGetter: (params) => (params.value ? "正常" : "停用"),
    },
    {
      field: "actions",
      headerName: "操作",
      flex: 1,
      type: "actions",
      headerAlign: "center",
      align: "left",
      getActions: (record) => {
        const { row } = record;
        return [
          <Stack
            key="stack"
            direction="row"
            sx={{ justifyContent: "flex-start" }}
          >
            <Button key="a" onClick={() => update(row.id, !row.enable)}>
              {row.enable ? "停用" : "启用"}
            </Button>
            <Button key="b" onClick={() => setEditFormula(row)}>
              编辑
            </Button>
            {!row.enable && (
              <Button onClick={() => remove(row.id)}>删除</Button>
            )}
          </Stack>,
        ];
      },
    },
  ];
  return (
    <Container>
      <Breadcrumbs>
        <Typography color="text.primary">配方管理</Typography>=
      </Breadcrumbs>
      <Divider />
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* <Grid item xs={3}>
          <TextField
            label="配方名"
            variant="outlined"
            size="small"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            label="配方状态"
            variant="outlined"
            size="small"
            fullWidth
            value={filter.enable}
            onChange={(e) => setFilter({ ...filter, enable: e.target.value })}
          >
            <MenuItem key="0" value="">
              选择配方状态
            </MenuItem>
            <MenuItem key="1" value="true">
              正常
            </MenuItem>
            <MenuItem key="2" value="false">
              停用
            </MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={1}>
          <Button variant="outlined" onClick={onReset}>
            重置
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" onClick={() => ref.current.query()}>
            查询
          </Button>
        </Grid> */}
        <Grid item xs={1}>
          <Button variant="text" onClick={() => setOpen(true)}>
            新增
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FetchTable columns={columns} rows={rows} />
        </Grid>
      </Grid>
      <DialogForm
        methods={methods}
        title="新增配方"
        onClose={onClose}
        open={open}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={2} sx={{ p: 1 }}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          <RHFInput label="配方码" name="code" />
          <RHFInput label="配方名称" name="name" />
        </Stack>
      </DialogForm>
      <DialogForm
        methods={methods2}
        open={open2}
        title="修改配方"
        onClose={onClose2}
        onSubmit={handleSubmit2(onSubmit2)}
      >
        <Stack spacing={2} sx={{ p: 1 }}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          <TextField
            label="配方码"
            name="code"
            defaultValue={editFormula?.code}
            InputProps={{
              readOnly: true,
            }}
          />
          <RHFInput label="配方名称" name="name" />
        </Stack>
      </DialogForm>
    </Container>
  );
}

FormulaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
