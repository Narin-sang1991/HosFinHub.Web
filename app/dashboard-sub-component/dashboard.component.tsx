"use client"
import { CloseCircleOutlined, CloseOutlined, CloudSyncOutlined, SignatureOutlined, WalletOutlined } from "@ant-design/icons"
import { Card, Col, Row, Statistic, Typography } from "antd"
import React from "react"

export interface DashboardModel {
  data: {
    title: string
    cut_off_batch: number
    received: number
    fdn: number
    rejected: number
    approved: number
    settled: number
  }
}
const Dashboard = (props: DashboardModel) => {

  return (
    <React.Fragment>
      <Col lg={{ span: 24 }}>
        <Typography.Title level={3}>{props.data.title}</Typography.Title>
        <Row gutter={[8, 8]}>
          <Col lg={{ span: 6 }}>
            <Card>
              <Statistic title="fdh รับข้อมูล" value={props.data.fdn} prefix={<CloudSyncOutlined />} suffix="ราย" />
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            <Card>
              <Statistic title="สปสช.รับข้อมูล" value={props.data.received} prefix={<CloudSyncOutlined />} suffix="ราย" />
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            <Card>
              <Statistic title="ไม่ผ่าน" value={props.data.rejected} prefix={<CloseOutlined />} suffix="ราย" />
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            <Card>
              <Statistic title="อนุมัติ" value={props.data.approved} prefix={<SignatureOutlined />} suffix="ราย" />
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            <Card>
              <Statistic title="โอนเงินเรียบร้อย" value={props.data.settled} prefix={<WalletOutlined />} suffix="ราย" />
            </Card>
          </Col>
          <Col lg={{ span: 6 }}>
            <Card>
              <Statistic title="ตัดรอบเบิกจ่าย" value={props.data.cut_off_batch} prefix={<WalletOutlined />} suffix="ราย" />
            </Card>
          </Col>
        </Row>
      </Col>

    </React.Fragment>
  )
}

export default Dashboard