import { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import { getLog } from "@/api/mainApi";
import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";

type Log = {
  operId: number;
  operTime: string;
  title: string;
  operParam: string;
  operName: string;
  operIp: string;
};

export default function LogPage() {
  const [dataList, setDataList] = useState<Log[]>([]);

  const query = () => {
    getLog().then((res) => {
      if (res.data.code === 200) {
        setDataList(res.data.data);
      } else {
        console.log(res.data.msg);
      }
    });
  };

  useEffect(() => {
    query();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "操作时间",
      dataIndex: "operTime",
      width: 300,
      fixed: true,
    },
    {
      title: "操作功能",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "请求参数",
      dataIndex: "operParam",
    },
    {
      title: "操作人",
      dataIndex: "operName",
    },

    {
      title: "IP地址",
      dataIndex: "operIp",
    },
  ];
  return (
    <Container>
      <Breadcrumbs>
        <Typography color="text.primary">操作日志</Typography>=
      </Breadcrumbs>
      <Divider />
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={2}>
          <TextField label="操作模块" />
        </Grid>
        <Grid item xs={2}>
          <TextField label="操作人" />
        </Grid>
        <Grid item xs={3}>
          <DateRangePicker
            label="操作日期"
            slots={{ field: SingleInputDateRangeField }}
            onChange={(res) => console.log(res)}
            format="yyyy/MM/dd"
          />
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={1}>
          <Button>重置</Button>
        </Grid>
        <Grid item xs={1}>
          <Button>查询</Button>
        </Grid>
        <Grid item xs={12}>
          <Table rowKey="operId" columns={columns} dataSource={dataList} />
        </Grid>
      </Grid>
    </Container>
  );
}

LogPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);
