import { getColResponsive } from "@/client.component/antd.col.resposive";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getResult, saveAsync } from "@/store/work-opd/workOpdSlice";
import { selectUccOption } from "@/store/insure/insureOpdSlice";
import { Divider, Form, Input, Row, Select } from "antd";
import React from "react";

const InsureInfo = () => {
  const dispatch = useAppDispatch();
  const originData = useAppSelector(getResult);
  const selectUccOptions = useAppSelector(selectUccOption);

  const onChangeOpdUuc = async (value: string) => {
    const newOpd = originData?.opd.map((itemOpd) => {
      const newItemOpd = { ...itemOpd }
      newItemOpd.uuc = value
      return newItemOpd;
    });

    const updatedOriginData = { ...originData, opd: newOpd };
    await dispatch(saveAsync({ ...updatedOriginData }));
  }

  return (
    <React.Fragment>
      <Divider orientation="left" plain><h3>ข้อมูลสิทธิ</h3></Divider>
      <Row gutter={[16, 16]}>
        {
          getColResponsive({
            key: 'UUC',
            children: <Form.Item label="การใช้สิทธิ์" name="UUC" >
              <Select
                onChange={onChangeOpdUuc}
                options={selectUccOptions}>
              </Select>
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'PatientSInsclex',
            children: <Form.Item label="สิทธิประโยชน์" name="Inscl" >
              <Input readOnly />
            </Form.Item>
          })
        }
        {
          getColResponsive({
            key: 'SubType',
            children: <Form.Item label="โครงการพิเศษ" name="SubType" >
              <Input readOnly />
            </Form.Item>
          })
        }

        {
          getColResponsive({
            key: 'Premitno',
            children: <Form.Item label="รหัส Authen Code / เลขอนุมัติ" name="Premitno" >
              <Input readOnly />
            </Form.Item>
          })
        }
      </Row>
    </React.Fragment>
  )
}

export default InsureInfo

