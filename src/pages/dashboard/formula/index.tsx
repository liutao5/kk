import {
  addFormula,
  getFormula,
  removeFormula,
  updateFormula,
  updateFormulaStatus,
} from "@/api/mainApi";
import DialogForm from "@/components/dialog-form";
import FetchTable from "@/components/fetch-table";
import RHFInput from "@/components/hook-form/RHFInput";
import { useSettingsContext } from "@/components/settings";
import DashboardLayout from "@/layouts/dashboard";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid-premium";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
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

const defaultFilter = {
  name: "",
  enable: "",
};

export default function FormulaPage() {
  const [filter, setFilter] = useState<Record<string, any>>(defaultFilter);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [editFormula, setEditFormula] = useState<Formula>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [deleteId, setDeleteId] = useState<string>();

  const openRemove = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const query = () => {
    getFormula(filter).then((res) => {
      if (res.data.code === 200) {
        console.log(res.data.data);
        setRows(res.data.data);
      }
    });
  };

  const onReset = () => {
    setFilter(defaultFilter);
    getFormula().then((res) => {
      if (res.data.code === 200) {
        setRows(res.data.data);
      }
    });
  };

  useEffect(() => {
    query();
  }, []);

  const update = (id: number, enable: boolean) => {
    updateFormulaStatus(id, enable).then((res) => {
      if (res.data.code === 200) {
        query();
      }
    });
  };

  const handleRemove = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | undefined
  ) => {
    setDeleteId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const remove = () => {
    removeFormula(deleteId || "").then((res) => {
      if (res.data.code === 200) {
        query();
      } else {
        enqueueSnackbar(res.data.msg, {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
      handleClose();
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

  const onSubmit = (data: FormulaProps) => {
    const { name, code } = data;
    addFormula(name, code).then((res) => {
      if (res.data.code === 200) {
        onClose();
        onReset();
      } else {
        reset();
        setError("afterSubmit", {
          message: res.data.msg,
        });
      }
    });
  };

  const defaultValues2 = {
    name: "",
  };

  const FormulaSchema2 = Yup.object().shape({
    name: Yup.string().required("请输入配方名称"),
  });

  const methods2 = useForm<Omit<FormulaProps, "code">>({
    resolver: yupResolver(FormulaSchema2),
    defaultValues: defaultValues2,
  });

  const {
    setValue,
    handleSubmit: handleSubmit2,
    reset: reset2,
    setError: setError2,
    formState: { errors: errors2 },
  } = methods2;

  useEffect(() => {
    setValue("name", editFormula?.name || "");
    setOpen2(!!editFormula);
  }, [editFormula, setValue]);

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
            <>
              <Button
                disabled={row.enable}
                aria-describedby={id}
                onClick={(e) => handleRemove(e, row.id)}
              >
                删除
              </Button>
              <Popover
                id={id}
                open={openRemove}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography>确认删除?</Typography>
                  <Button onClick={() => remove()}>确认</Button>
                  <Button onClick={handleClose}>取消</Button>
                </Box>
              </Popover>
            </>
          </Stack>,
        ];
      },
    },
  ];
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <Breadcrumbs>
        <Typography variant="h5" color="text.primary" gutterBottom>
          配方管理
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField
            label="配方名"
            variant="outlined"
            size="small"
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.name && (
                    <IconButton
                      size="small"
                      onClick={() => setFilter({ ...filter, name: "" })}
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
            label="配方状态"
            variant="outlined"
            size="small"
            fullWidth
            value={filter.enable}
            onChange={(e) => setFilter({ ...filter, enable: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {filter.enable && (
                    <IconButton
                      size="small"
                      onClick={() =>
                        setFilter({ ...filter, enable: undefined })
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
        <Grid item xs={6}></Grid>
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
              <Button variant="text" onClick={() => setOpen(true)}>
                新增
              </Button>
            }
          />
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
            variant="filled"
            InputProps={{
              readOnly: true,
            }}
          />
          <RHFInput label="配方名称" name="name" autoFocus />
        </Stack>
      </DialogForm>
    </Container>
  );
}

FormulaPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
