import { getColResponsive } from "@/client.component/antd.col.resposive";
import { opTypes } from "@/client.constant/patient.constant";
import { useAppSelector } from "@/store/hooks";
import { selectUccOption } from "@/store/insure/insureOpdSlice";
import { Divider, Form, Input, Row, Select } from "antd";
import React from "react";

interface InsureInfoProps {
  isIPD: boolean
}

const InsureInfo = ({ isIPD }: InsureInfoProps) => {
  const selectUccOptions = useAppSelector(selectUccOption);
  return (
    <React.Fragment>
      <Divider orientation="left" plain><h3>ข้อมูลสิทธิ</h3></Divider>
      <Row gutter={[16, 16]}>
        {
          getColResponsive({
            key: 'UUC',
            children: <Form.Item label="การใช้สิทธิ์" name="UUC" >
              <Select options={selectUccOptions} />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'PatientSInsclex',
            children: <Form.Item label="สิทธิประโยชน์" name="Inscl" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'SubType',
            children: <Form.Item label="โครงการพิเศษ" name="SubType" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'Premitno',
            children: <Form.Item label="รหัส Authen Code / เลขอนุมัติ" name="Premitno" >
              <Input readOnly variant="filled" />
            </Form.Item>
          })
        }
        {
          isIPD ? <></> : getColResponsive({
            key: 'OpType',
            children: <Form.Item label="ประเภทการให้บริการ" name="OpType" rules={[{ required: true }]} >
              <Select options={opTypes.map(t => { return { label: t.text, value: t.key.toString() } })} />
            </Form.Item>
          })
        }
      </Row>
    </React.Fragment>
  )
}

export default InsureInfo

