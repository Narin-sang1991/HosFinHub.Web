"use client";

//#region Import
import React, { useState, useEffect } from "react"
import moment from "moment";
import {
    Checkbox, Form,
    Input, Row, Space, Switch,
    Typography, notification
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { AccidentEmergencyModel, AccidentEmergencyEditorModel } from '@/store/refer/accidentEmergencyModel'
import { getColResponsive } from "@/client.component/antd.col.resposive";
import { dateDisplayFormat } from "@/client.constant/format.constant";
//#endregion

interface AccidentEmergencyProps {
    accidentEmergency?: AccidentEmergencyModel,
    isReferIn: boolean,
    onChange?: any,
}
const { Text } = Typography;
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const AccidentEmergencyEditor = function AccidentEmergency({ accidentEmergency, isReferIn, onChange }: AccidentEmergencyProps) {

    const [formRefer] = Form.useForm();
    const [showInput, setShowInput] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        let referStateType = isReferIn ? accidentEmergency?.ireftype : accidentEmergency?.oreftype;
        let hosRefCode = (isReferIn ? accidentEmergency?.refmaini : accidentEmergency?.refmaino) ?? "";
        let editingData: AccidentEmergencyEditorModel = {
            HasReferData: accidentEmergency != undefined,
            DateText: accidentEmergency?.dateopd ? moment(accidentEmergency.dateopd).format(dateDisplayFormat) : '',
            ReferNo: accidentEmergency?.refer_no || '',
            HospitalRefCode: hosRefCode,
            Diagnose: convertReferStat(0, referStateType),
            Heal: convertReferStat(1, referStateType),
            KeepHeal: convertReferStat(2, referStateType),
            DemandOfPatient: convertReferStat(3, referStateType),
        };
        setShowInput(editingData.HasReferData)
        formRefer.setFieldsValue({ ...editingData });
    }, [accidentEmergency]);

    //#region Local Filter & Function
    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: 'ไม่สามารถแก้วัตถุประสงค์ได้',
            description: 'เนื่องจากไม่มีบันทึกข้อมูล Refer บนระบบ Hospital-OS',
            placement: 'bottomRight'
        });
    };

    function triggerChange(changedValues: any, allValues: AccidentEmergencyEditorModel): void {
        setShowInput(allValues.HasReferData)
        if (accidentEmergency == undefined && allValues.HasReferData == true) openNotificationWithIcon('warning');
        if (accidentEmergency == undefined) return;
        if (allValues.HasReferData == false) formRefer.resetFields(['Diagnose', 'Heal', 'KeepHeal', 'DemandOfPatient']);

        const data = { ...allValues };
        let changedData: AccidentEmergencyModel = { ...accidentEmergency };

        let referStateType: string = revertToReferStat(data);
        if (isReferIn) changedData.ireftype = referStateType;
        else changedData.oreftype = referStateType;

        if (onChange) onChange(changedData, allValues.HasReferData);
    }

    function convertReferStat(index: number, refStateType?: string): boolean {
        if (refStateType == "" || refStateType == undefined) return false;
        return refStateType.charAt(index) == '0' ? false : true;
    }

    function revertToReferStat(data?: AccidentEmergencyEditorModel): string {
        if (data == null || data == undefined) return '0000';

        let diagnoseChr: string = (data.Diagnose == true ? '1' : '0');
        let healChr: string = (data.Heal == true ? '1' : '0');
        let keepHealChr: string = (data.KeepHeal == true ? '1' : '0');
        let demandOfPatientChr: string = (data.DemandOfPatient == true ? '1' : '0');

        return `${diagnoseChr}${healChr}${keepHealChr}${demandOfPatientChr}`;
    }
    //#endregion

    return (
        <div style={{ width: '99%' }} >
            <Form name={isReferIn ? "formReferIn" : "formReferOut"} form={formRefer}
                layout="vertical" onValuesChange={triggerChange}
            >
                <Row gutter={[16, 0]} justify='space-between' >
                    {
                        getColResponsive({
                            key: 'dateopd', span: showInput ? 1 : 3,
                            children: <Space direction="horizontal">
                                <Form.Item label={<Text underline >ส่งเคลม :</Text>} name="HasReferData" >
                                    <Switch
                                        checkedChildren={<CheckOutlined />}
                                        unCheckedChildren={<CloseOutlined />}
                                    />
                                </Form.Item>
                                {
                                    showInput ? <Form.Item label="วันเข้ารับบริการ" name="DateText" >
                                        <Input readOnly variant="filled" />
                                    </Form.Item> : <></>
                                }
                            </Space>
                        })
                    }
                    {
                        showInput ? getColResponsive({
                            key: 'refmaini',
                            children: <Form.Item label={isReferIn ? "โรงพยาบาลต้นทาง" : "โรงพยาบาลปลายทาง"} name="HospitalRefCode" >
                                <Input readOnly variant="filled" />
                            </Form.Item>
                        }) : <></>
                    }
                    {
                        showInput ? getColResponsive({
                            key: 'refer_no',
                            children: <Form.Item label={isReferIn ? "เลขที่ Refer-in" : "เลขที่ Refer-out"} name="ReferNo" >
                                <Input readOnly variant="filled" />
                            </Form.Item>
                        }) : <></>
                    }
                    {
                        showInput ? getColResponsive({
                            key: 'diagnose', span: 3,
                            children: <Space style={{ marginBottom: -20, marginTop: -10, padding: 0 }} direction="horizontal" align="baseline" size="large" >
                                <Form.Item name="title" >
                                    {isReferIn
                                        ? <Text type="warning" italic >วัตถุประสงค์รับเข้า</Text>
                                        : <Text type="danger" italic >วัตถุประสงค์ส่งต่อ</Text>
                                    }
                                </Form.Item>
                                <Form.Item name="Diagnose" valuePropName="checked">
                                    <Checkbox >วินิจฉัย</Checkbox>
                                </Form.Item>
                                <Form.Item name="Heal" valuePropName="checked">
                                    <Checkbox >รับรักษา</Checkbox>
                                </Form.Item>
                                <Form.Item name="KeepHeal" valuePropName="checked">
                                    <Checkbox >รับไว้รักษาต่อเนื่อง(ส่งกลับ)</Checkbox>
                                </Form.Item>
                                <Form.Item name="DemandOfPatient" valuePropName="checked">
                                    <Checkbox >ตามความต้องการผู้ป่วย</Checkbox>
                                </Form.Item>
                            </Space>
                        }) : <></>
                    }
                </Row>
            </Form>
            {contextHolder}
        </div>
    )
}

export default AccidentEmergencyEditor