"use client";

//#region Import
import React, { useState, useEffect } from "react"
import { Form, Input, Row, } from "antd";
import type { TableColumnsType } from "antd";
import { AccidentEmergencyModel, AccidentEmergencyEditorModel } from '@/store/refer/accidentEmergencyModel'
import { getColResponsive } from "@/client.component/antd.col.resposive";
//#endregion

interface AccidentEmergencyProps {
    accidenEmergency?: AccidentEmergencyModel,
    isReferIn: boolean,
    onChange?: any,
}


const AccidentEmergencyTab = function AccidentEmergency({ accidenEmergency, isReferIn, onChange }: AccidentEmergencyProps) {

    const [formRefer] = Form.useForm();

    useEffect(() => {
        let referStateType = isReferIn ? accidenEmergency?.ireftype : accidenEmergency?.oreftype;
        let hosRefCode = isReferIn ? accidenEmergency?.refmaini : accidenEmergency?.refmaino;
        formRefer.setFieldsValue({
            DateText: accidenEmergency?.dateopd || '',
            ReferNo: accidenEmergency?.refer_no || '',
            HospitalRefCode: hosRefCode,
            Diagnose: convertReferStat(0, referStateType),
            Heal: convertReferStat(1, referStateType),
            KeepHeal: convertReferStat(2, referStateType),
            DemandOfPatient: convertReferStat(3, referStateType),
        });
    }, [accidenEmergency]);

    //#region Local Filter & Function
    const columns: TableColumnsType<AccidentEmergencyModel> = [
        {
            key: 'dateopd',
            title: 'วันเข้ารับบริการ',
            dataIndex: 'dateopd',
            fixed: "left",
        },
        {
            key: 'aedate',
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'aedate',
            fixed: "left",
        },
        {
            key: 'aetime',
            title: 'เวลาที่เกิดอุบัติเหตุ',
            dataIndex: 'aetime',
            fixed: "left",
        },
        {
            key: 'emtype',
            title: 'รหัสบ่งชี้ความเร่งด่วน',
            dataIndex: 'emtype',
            fixed: "left",
        },
        {
            key: 'ucae',
            title: 'รหัสบ่งบอกการรักษา',
            dataIndex: 'ucae',
            fixed: "left",
        },
        {
            key: 'aetype',
            title: 'สิทธิ์การรักษาอื่น',
            dataIndex: 'aetype'
        },
        {
            key: 'refer_no',
            title: 'เลขที่ใบส่งต่อ',
            dataIndex: 'refer_no'
        },
        {
            key: 'refmaini',
            title: 'โรงพยาบาลต้นทาง',
            dataIndex: 'refmaini'
        },
        {
            key: 'ireftype',
            title: 'วัตถุประสงค์ที่รับเข้า',
            dataIndex: 'ireftype'
        },
        {
            key: 'refmaino',
            title: 'โรงพยาบาลที่ส่งต่อ',
            dataIndex: 'refmaino'
        },
        {
            key: 'oreftype',
            title: 'วัตถุประสงค์ที่ส่งต่อ',
            dataIndex: 'oreftype'
        },

    ]

    function triggerChange(): void {
        let data: AccidentEmergencyEditorModel = formRefer.getFieldsValue() as AccidentEmergencyEditorModel;
        console.log('data :', data);

        let originalSource: AccidentEmergencyModel = accidenEmergency != undefined ? { ...accidenEmergency }
            : {
                id: "",
                hn: "",
                an: "",
                dateopd: "",
                aedate: "",
                refer_no: "",
                refmaini: "",
                ireftype: "",
                refmaino: "",
                oreftype: "",
                seq: "",
                aestatus: "",
                dalert: "",
                talert: ""
            };
        let referStateType: string = revertToReferStat(data);
        if (isReferIn) originalSource.ireftype = referStateType;
        else originalSource.oreftype = referStateType;

        if (onChange) onChange(originalSource);
    }

    function convertReferStat(index: number, refStateType?: string): boolean {
        if (refStateType == "" || refStateType == undefined) return false;

        return refStateType.charAt(index) == '0' ? true : false
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
        <React.Fragment>
            <Row gutter={[16, 4]} >
                {
                    getColResponsive({
                        key: 'dateopd',
                        children: <Form.Item label="วันเข้ารับบริการ" name="DateText" >
                            <Input readOnly variant="filled" />
                        </Form.Item>
                    })
                }
                {
                    getColResponsive({
                        key: 'refmaini',
                        children: <Form.Item label="โรงพยาบาลต้นทาง" name="HospitalRefCode" >
                            <Input readOnly variant="filled" />
                        </Form.Item>
                    })
                }
                {
                    getColResponsive({
                        key: 'refer_no',
                        children: <Form.Item label="เลขที่ใบส่งต่อ" name="ReferNo" >
                            <Input readOnly variant="filled" />
                        </Form.Item>
                    })
                }
            </Row>
        </React.Fragment>
    )
}

export default AccidentEmergencyTab