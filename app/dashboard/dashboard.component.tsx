"use client"
import { DashboardModel } from "@/store/dashboard/dashboard.entity"
import { UserOutlined } from "@ant-design/icons"
import { Card, Col, Row, Statistic, Typography } from "antd"
import React from "react"

export interface DashboardTypeModel {
  type: 'opd' | 'ipd',
  dashboardList: DashboardModel[]
}

const Dashboard = (props: DashboardTypeModel) => {

  return (
    <React.Fragment>
      <Col lg={{ span: 24 }}>
        <Typography.Title level={3}>{props.type}</Typography.Title>
        <Row gutter={[8, 8]}>

          {
            props.dashboardList.map(item => (
              <Col lg={{ span: 6 }}>
                <Card>
                  <Statistic title={item.fdh_status_message_th + " / " + item.fdh_status_message} value={item.vn} prefix={<UserOutlined />} suffix="ราย" />
                </Card>
              </Col>
            ))
          }
        </Row>
      </Col>

    </React.Fragment>
  )
}

export default Dashboard