import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import DashboardLayout from "../layout";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { cancelRemoval, getRemoval } from "@/api/mainApi";

type Removal = {
  id: number;
  orderCode: string;
  status: number;
  creatorName: string;
  type: number;
  createTime: string;
  updateTime: string;
};

const removalStatusMap = {
  0: "待出库",
  2: "出库中",
  3: "已出库",
  5: "已取消",
};

const typeMap = {
  0: "标准出库",
};

export default function RemovalPage() {
  const [dataList, setDataList] = useState<Removal[]>([]);
  const query = () => {
    getRemoval().then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        setDataList(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  };

  const handleCancel = (id: number) => {
    cancelRemoval(id).then((res) => console.log(res));
  };

  useEffect(() => {
    query();
  }, []);

  const columns = [
    {
      title: "出库单",
      dataIndex: "orderCode",
    },
    {
      title: "配方名",
      dataIndex: "",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (value: 0 | 2 | 3 | 5) => removalStatusMap[value],
    },
    {
      title: "申请人",
      dataIndex: "creatorName",
    },
    {
      title: "单据类型",
      dataIndex: "type",
      render: (value: 0) => typeMap[value],
    },
    {
      title: "申请时间",
      dataIndex: "createTime",
    },
    {
      title: "变更时间",
      dataIndex: "updateTime",
    },
    {
      title: "操作",
      dataIndex: "status",
      render: (value: number, record: Removal) => (
        <>
          <Button>详情</Button>
          {value === 0 ||
            value === 2 ||
            (true && (
              <Button onClick={() => handleCancel(record.id)}>取消</Button>
            ))}
        </>
      ),
    },
  ];
  return (
    <Container>
      <Breadcrumbs>
        <Typography>出库管理</Typography>
      </Breadcrumbs>
      <Divider />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField label="出库单号" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="配方名" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="状态" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="申请日期" />
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={1}>
          <Button>重置</Button>
        </Grid>
        <Grid item xs={1}>
          <Button>查询</Button>
        </Grid>
        <Grid item xs={12}>
          <Table rowKey="id" columns={columns} dataSource={dataList} />
        </Grid>
      </Grid>
    </Container>
  );
}

RemovalPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
