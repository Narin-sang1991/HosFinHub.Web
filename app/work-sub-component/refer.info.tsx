import { getColResponsive } from "@/client.component/antd.col.resposive";
import { Divider, Form, Input, Row, Select } from "antd";
import React from "react";

const ReferInfo = () => {
  return (
    <React.Fragment>
      <Divider orientation="left" plain><h3>ข้อมูลการส่งต่อ</h3></Divider>
      <Row gutter={[16, 16]}>
        {
          getColResponsive({
            key: 'Clinic',
            children: <Form.Item label="คลีนิกที่รับบริการ" name="Clinic" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'Refer',
            children: <Form.Item label="รหัสสถานพยาบาลที่ส่งต่อ" name="InsRefercl" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'ReferType',
            children: <Form.Item label="ประเภทการส่งต่อ" name="ReferType" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'ReferDate',
            children: <Form.Item label="วันที่ส่งต่อ" name="ReferDate" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
      </Row>
    </React.Fragment>
  )
}

export default ReferInfo

