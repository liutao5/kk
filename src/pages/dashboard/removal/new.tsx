import FetchTable from "@/components/fetch-table";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFInput from "@/components/hook-form/RHFInput";
import RHFSelect from "@/components/hook-form/RHFSelect";
import DashboardLayout from "@/layouts/dashboard";
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
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";

import CloseIcon from "@mui/icons-material/Close";
import { GridColDef, useGridApiRef } from "@mui/x-data-grid-premium";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { addOrder, getFormula, getStockNum } from "@/api/mainApi";
import { enqueueSnackbar } from "@/components/snackbar";
import { useSettingsContext } from "@/components/settings";

interface FormProps {
  creatorName: string;
  type: string;
  remark?: string;
}

interface Formula {
  recipeId: number;
  recipeName: string;
  number: number;
}

export default function NewRemovalPage() {
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState<Formula[]>([]);
  const [right, setRight] = useState<Formula[]>([]);
  const [formulaList, setFormulaList] = useState<Formula[]>([]);
  const [rows, setRows] = useState<Formula[]>([]);

  const apiRef = useGridApiRef();

  useEffect(() => {
    getStockNum().then((res) => {
      if (res.data.code === 200) {
        setFormulaList(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    console.log("formulaList", formulaList);
    setLeft(formulaList);
  }, [formulaList]);

  const RemovalSchema = Yup.object().shape({
    creatorName: Yup.string().required("请输入申请人"),
    type: Yup.string().required("请选择单据类型"),
  });

  const defaultValues = {
    creatorName: "",
    type: "0",
  };

  const methods = useForm<FormProps>({
    resolver: yupResolver(RemovalSchema),
    defaultValues,
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: FormProps) => {
    console.log(data);
    const tableData = rows.map((row) => apiRef.current.getRow(row.recipeId));
    addOrder({
      ...data,
      items: tableData,
    }).then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        enqueueSnackbar("新建成功", {
          autoHideDuration: 2000,
          variant: "success",
        });
        push("/dashboard/removal");
      } else {
        enqueueSnackbar(res.data.msg || "新建失败", {
          autoHideDuration: 2000,
          variant: "error",
        });
      }
    });
  };

  const onClose = () => setOpen(false);

  const onOK = () => {
    setRows(right.map((r) => ({ ...r, totalNumber: 1 })));
    onClose();
  };

  useEffect(() => console.log(right), [right]);

  const columns: GridColDef[] = [
    {
      field: "recipeName",
      headerName: "配方名称",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "unit",
      headerName: "物资单位",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: () => <>吨包</>,
    },
    {
      field: "binType",
      headerName: "库区",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: () => <>困料库区</>,
    },
    {
      field: "number",
      headerName: "库存数量",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "totalNumber",
      headerName: "申请数量(可编辑)",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      editable: true,
      type: "number",
    },
    // {
    //   field: "remark",
    //   headerName: "其他说明",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    //   sortable: false,
    // },
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
            <Button
              onClick={() => {
                console.log(record, left, right);
                setLeft([...left, record.row]);
                setRight((right) =>
                  right.filter((r) => r.recipeId !== record.row.recipeId)
                );
                setRows((pre) =>
                  pre.filter((row) => row.recipeId !== record.id)
                );
              }}
            >
              删除
            </Button>
          </>,
        ];
      },
    },
  ];
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={themeStretch ? false : "xl"}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Breadcrumbs>
            <Typography variant="h4" color="text.primary" gutterBottom>
              新建出库单
            </Typography>
          </Breadcrumbs>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button onClick={() => push("/dashboard/removal")}>取消</Button>
          <Button type="submit">保存</Button>
        </Stack>
        <Divider />
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6">基础信息</Typography>
          </Grid>
          <Grid item xs={4}>
            <RHFInput label="申请人" size="small" name="creatorName" />
          </Grid>
          <Grid item xs={4}>
            <RHFSelect label="单据类型" fullWidth size="small" name="type">
              <MenuItem value="0">标准出库</MenuItem>
            </RHFSelect>
          </Grid>
          <Grid item xs={12}>
            <RHFInput label="备注" size="small" name="remark" />
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <Typography variant="h6">详细信息</Typography>
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <FetchTable
              apiRef={apiRef}
              columns={columns}
              editMode="row"
              rows={rows}
              getRowId={(row) => row.recipeId}
              customToobar={
                <Button variant="text" onClick={() => setOpen(true)}>
                  选择物资
                </Button>
              }
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
        <DialogTitle variant="h5">选择物资</DialogTitle>
        <IconButton
          onClick={onClose}
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper>
                <Typography variant="h6">可选物资</Typography>
                <List
                  sx={{
                    maxHeight: 300,
                    height: 300,
                    overflow: "auto",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {left.map((item) => (
                    <ListItemButton
                      key={item.recipeId}
                      sx={{
                        mb: 1,
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                      }}
                      onClick={() => {
                        const tempRight = [...right];
                        tempRight.push(item);
                        setRight(tempRight);
                        setLeft([
                          ...left.filter((li) => li.recipeId !== item.recipeId),
                        ]);
                      }}
                    >
                      <ListItemText sx={{ textAlign: "center" }}>
                        {item.recipeName}
                      </ListItemText>
                      <Box sx={{ flexGrow: 1 }} />
                      <ListItemText sx={{ textAlign: "center" }}>
                        <Typography
                          component="span"
                          color="#f59e0b"
                          fontSize={24}
                        >
                          {item.number}
                        </Typography>
                        吨包
                      </ListItemText>
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper>
                <Typography variant="h6">已选物资</Typography>
                {right.length === 0 ? (
                  <Box sx={{ height: 300 }} />
                ) : (
                  <List
                    sx={{
                      maxHeight: 300,
                      height: 300,
                      overflow: "auto",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {right.map((item) => (
                      <ListItemButton
                        key={item.recipeId}
                        sx={{
                          mb: 1,
                          backgroundColor: "#ffffff",
                          borderRadius: 1,
                        }}
                        onClick={() => {
                          const tempLeft = [...left];
                          tempLeft.push(item);
                          setLeft(tempLeft);
                          setRight([
                            ...right.filter(
                              (li) => li.recipeId !== item.recipeId
                            ),
                          ]);
                        }}
                      >
                        <ListItemText sx={{ textAlign: "center" }}>
                          {item.recipeName}
                        </ListItemText>
                        <Box sx={{ flexGrow: 1 }} />
                        <ListItemText sx={{ textAlign: "center" }}>
                          <Typography
                            component="span"
                            color="#f59e0b"
                            fontSize={24}
                          >
                            {item.number}
                          </Typography>
                          吨包
                        </ListItemText>
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onOK}>确定</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

NewRemovalPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
