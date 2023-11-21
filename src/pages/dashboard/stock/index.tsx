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
import { cancelStock, getStock } from "@/api/mainApi";
import { MX } from "../MX";

type Stock = {
  code: string;
  blCode: string;
  recipeName: string;
  binType: number;
  binCode: string;
  stockAge: number;
  mxs: MX[];
};

const binTypeMap = ["在途库区", "虚拟库区", "困料库区"];

export default function StockPage() {
  const [dataList, setDataList] = useState<Stock[]>([]);

  const cancel = (id: string) => {
    cancelStock(id).then((res) => console.log(res));
  };
  useEffect(() => {
    getStock().then((res) => {
      console.log(res);
      if (res.data.code === 200) {
        setDataList(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  }, []);

  const columns = [
    {
      title: "吨包号",
      dataIndex: "code",
    },
    {
      title: "批次号",
      dataIndex: "blCode",
    },
    {
      title: "配方名",
      dataIndex: "recipeName",
    },
    {
      title: "库区类型",
      dataIndex: "binType",
      render: (value: number) => binTypeMap[value],
    },
    {
      title: "库位编码",
      dataIndex: "binCode",
    },
    {
      title: "库龄(天)",
      dataIndex: "stockAge",
    },
    {
      title: "MX信息",
      dataIndex: "mxs",
      render: () => {
        return <>mxs</>;
      },
    },
    {
      title: "操作",
      dataIndex: "binType",
      render: (value: number, record: Stock) => {
        return (
          value === 0 && (
            <Button onClick={() => cancel(record.code)}>取消入库</Button>
          )
        );
      },
    },
  ];
  return (
    <Container>
      <Breadcrumbs>
        <Typography color="text.primary">在库管理</Typography>=
      </Breadcrumbs>
      <Divider />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField label="吨包号" size="small" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="批次号" size="small" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="配方名" size="small" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="库区类型" size="small" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="库位编码" size="small" />
        </Grid>
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

StockPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
