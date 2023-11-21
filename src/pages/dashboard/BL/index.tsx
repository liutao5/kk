import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import DashboardLayout from "../layout";
import { useEffect, useState } from "react";
import { Table } from "antd";
import { getBL } from "@/api/mainApi";
import { MX } from "../MX";
import { ColumnsType } from "antd/es/table";
import { statusMap } from "..";

type BL = {
  id: number;
  batchCode: string;
  mxNumber: number;
  creatorName: string;
  status: number;
  createTime: string;
  updateTime: string;
  machineCode: string;
  items: MX & { mxCode: string }[];
};

export default function BLPage() {
  const [batchCode, setBatchCode] = useState<string>();
  const [recipeName, setRecipeName] = useState<string>();
  const [status, setStatus] = useState<string>("-1");
  const [dataList, setDataList] = useState<BL[]>([]);

  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const onReset = () => {
    setBatchCode(undefined);
    setRecipeName(undefined);
    setStatus("-1");
  };

  const query = () => {
    getBL(pageNum, pageSize).then((res) => {
      if (res.data.code === 200) {
        setDataList(res.data.data);
      } else {
      }
    });
  };

  useEffect(() => {
    query();
  }, []);

  const columns: ColumnsType<BL> = [
    {
      title: "批次号",
      dataIndex: "batchCode",
    },
    {
      title: "MX吨包数",
      dataIndex: "mxNumber",
    },
    {
      title: "制定人员",
      dataIndex: "creatorName",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (value: 0 | 3 | 5) => statusMap[value],
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "变更时间",
      dataIndex: "updateTime",
    },
    {
      title: "混拣机号",
      dataIndex: "machineCode",
    },
    {
      title: "操作",
      render: () => <Button>取消</Button>,
    },
  ];
  return (
    <Container>
      <Breadcrumbs>
        <Typography color="text.primary">BL批次管理</Typography>
      </Breadcrumbs>
      <Divider />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={3}>
          <TextField
            label="批次号"
            variant="outlined"
            size="small"
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="配方名"
            variant="outlined"
            size="small"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            select
            label="配方状态"
            variant="outlined"
            size="small"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem key="-1" value="-1">
              请选择配方状态
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
          <Button variant="outlined" onClick={onReset}>
            重置
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" onClick={() => query()}>
            查询
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={dataList}
            expandable={{
              expandRowByClick: true,
              expandedRowRender: (record) => (
                <>
                  <div>配方名</div>
                  {record.items.map((item) => (
                    <>{item.mxCode + "、"}</>
                  ))}
                </>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

BLPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
