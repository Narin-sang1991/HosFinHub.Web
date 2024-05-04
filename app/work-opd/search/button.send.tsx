"use client";

import { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import { SendOutlined, ExceptionOutlined } from "@ant-design/icons";
import { Button, Badge, Space } from "antd";
import React, { useEffect, useState } from "react";

const ButtonSent = (props: { opd: OpdSearchModel[] }) => {
  const [seq, setSeq] = useState<Array<string>>([])
  const [seqError, setSeqError] = useState<Array<string>>([])
  useEffect(() => {
    getSeq()
  }, [props])
  const getSeq = () => {
    const data = props.opd
    const sqlCompless: string[] = []
    const sqlError: string[] = []
    data.forEach(i => {
      if (i.error.length === 0) {
        sqlCompless.push(i.seq)
      } else {
        sqlError.push(i.seq)
      }
    })
    setSeq(sqlCompless)
    setSeqError(sqlError)
  }
  return (
    <React.Fragment>
      <Space size={"middle"}>
        <Badge color="green" count={seq.length} overflowCount={99999}>
          <Button type="primary" icon={<SendOutlined />}>ส่งข้อมูลทั้งหมด</Button>
        </Badge>
        <Badge color="red" count={seqError.length} overflowCount={99999}>
          <Button danger icon={<ExceptionOutlined />}>ข้อมูลไม่สมบูรณ์</Button>
        </Badge>
      </Space>
    </React.Fragment>
  )
}

export default ButtonSent