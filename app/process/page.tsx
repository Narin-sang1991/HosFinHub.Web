"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Form, Spin, Table, Tag } from "antd";
import { io } from "socket.io-client";
import type { FormProps, TableProps } from "antd";

type process = {
  procesName: string;
  procesNumber: number;
  procesStatus: string;
};
interface ProcesResponse {
  allprocess: number;
  process: Array<process>;
  status: string;
}

const { RangePicker } = DatePicker;

const socket = io("http://192.168.101.243:5201", {
  path: "/app.io/",
  transports: ["websocket"],
});

const columns: TableProps<process>["columns"] = [
  {
    title: "แฟ้ม",
    dataIndex: "procesName",
    key: "procesName",
  },
  {
    title: "สถานะ",
    dataIndex: "procesStatus",
    key: "procesStatus",
  },
  {
    title: "ลำดับที่",
    dataIndex: "procesNumber",
    key: "procesNumber",
    render: (_: any, rec) => {
      if (rec.procesNumber === 0) {
        return <Spin size="small" />;
      } else if (rec.procesNumber === 1) {
        return <Spin size="small" />;
      } else {
        return <Tag color="success">sucess</Tag>;
      }
    },
  },
];
const Process: React.FC = () => {
  const [processing, setProcessing] = useState<process[]>([]);
  const [dateDisabel, setDateDisable] = useState<boolean>(false);
  const [formDateProcess] = Form.useForm();

  const onChangeDate: FormProps['onFinish'] = (value) => {
    if (value.dateProcess === undefined) return
    const startDate = new Date(value.dateProcess[0].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" })
    const endDate = new Date(value.dateProcess[1].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" })
    const url = `http://192.168.101.243:5201/process/new-processing?dateStart=${startDate}&dateEnd=${endDate}`;
    fetch(url, {
      method: "get",
    });
  };

  const socketIo = useCallback(() => {
    socket.on("process", (data: ProcesResponse) => {
      setProcessing(data.process);
      if (data.status === "proces") {
        setDateDisable(true);
      } else {
        setDateDisable(false);
      }
    });
  }, []);

  useEffect(() => {
    socketIo();
  }, []);

  return (
    <React.Fragment>
      <Form
        layout="inline"
        form={formDateProcess}
        onFinish={onChangeDate}
      >
        <Form.Item name="dateProcess">
          <RangePicker disabled={dateDisabel} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">ประมวลผล</Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={processing}
        size="small"
        pagination={false}
        rowKey={"procesName"}
      />
    </React.Fragment>
  );
};

export default Process;
