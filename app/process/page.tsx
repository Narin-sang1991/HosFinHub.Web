"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DatePicker, Spin, Table, Tag } from "antd";
import { io } from "socket.io-client";
import type { TableProps } from "antd";

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

const socket = io("http://183.88.219.85:5200", {
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
  const onChangeDate = (_date: any, dateString: string[]) => {
    const url = `http://183.88.219.85:5200/process/new-processing?dateStart=${dateString[0]}&dateEnd=${dateString[1]}`;

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
      <RangePicker onChange={onChangeDate} disabled={dateDisabel} />
      <Table
        columns={columns}
        dataSource={processing}
        size="small"
        pagination={false}
      />
    </React.Fragment>
  );
};

export default Process;
