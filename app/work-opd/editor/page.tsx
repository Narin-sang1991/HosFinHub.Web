"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Button, Card, Form,
    Row, Col, Tabs,
    Space, Avatar, Typography,
    Input,
} from 'antd';
import { ManOutlined, WomanOutlined, MehOutlined, } from '@ant-design/icons';
import moment from "moment";
import withTheme from '../../../theme';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAsync, getResult, getStatus } from "@/store/work-opd/workOpdSlice";
import type { OpdEditorModel } from "@/store/work-opd/opdEditorModel";
import type { PatientDetailModel } from "@/store/patient/patientModel";
import '@/app/globals.css';

interface OpdEditorProps { }
const dateDisplayFormat: string = "DD MMM YYYY";
const defaultStrEmpty: string = "-";
const { Text } = Typography;

const OpdEditor = function OpdEditor(props: OpdEditorProps) {

    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const [formEditor] = Form.useForm();
    const status = useAppSelector(getStatus);
    const originData = useAppSelector(getResult);
    const [editingData, setEditData] = useState<OpdEditorModel>();
    const [editKey, setEditKey] = useState<any>(undefined);

    //#region Internal Effect
    useEffect(() => {
        const id = searchParams.get('id')
        if (id !== undefined) setEditKey(id);
    }, []);

    useEffect(() => {
        if (editKey !== undefined) {
            formEditor.resetFields();
            onGet(editKey);
        }
    }, [editKey]);

    useEffect(() => {
        if (originData === undefined) return;
        (async () => {
            let opdDetail = { ...originData.opd[0] };
            let patientDetail = { ...originData.pat[0] };
            let transformData: OpdEditorModel = {
                opd: opdDetail,
                patient: patientDetail,
                insureItems: originData.ins,
                adp: originData.adp,
                aer: originData.aer,
                cht: originData.cht,
                cha: originData.cha,
                dru: originData.dru,
            };
            setEditData(transformData);

            await formEditor.setFieldsValue({
                // HN: opdDetail.hn,
                // DateOpd: moment(opdDetail.dateopd).format(dateDisplayFormat),
                BodyTemp: opdDetail.btemp,
                SystolicBloodPressure: opdDetail.sbp,
                DiastolicBloodPressure: opdDetail.dbp,
                PulseRate: opdDetail.pr,
                RespiratorRate: opdDetail.rr,
                ServiceProviderType: opdDetail.optype,
                VisitType: opdDetail.typein,
                DischargeType: opdDetail.typeout,
            });
        })();
    }, [originData]);
    //#endregion

    //#region Async 
    async function onGet(id: any) {
        (async () => {
            await dispatch(getAsync({ seq: id }));
        })();
    }
    //#endregion

    //#region Internal function/method
    function getPatientName(patient?: PatientDetailModel) {
        if (patient !== undefined) {
            return `${patient.title}${patient.fname}  ${patient.lname}`
        }
        return defaultStrEmpty;
    }

    function getVisitType(typeIn?: number) {
        if (typeIn == 1) return "Walk-in";
        if (typeIn == 2) return "Appointment";
        if (typeIn == 3) return "Refer-in";
        if (typeIn == 4) return "EMS-in";
        return defaultStrEmpty;
    }

    function getDischargeType(typeOut?: number) {
        if (typeOut == 1) return "Discharge";
        if (typeOut == 2) return "Admit";
        if (typeOut == 3) return "Refer-out";
        if (typeOut == 4) return "Death-in-hospital";
        if (typeOut == 5) return "Death-before-arrive";
        if (typeOut == 6) return "Death-in-refer";
        if (typeOut == 7) return "Reject-to-heal";
        if (typeOut == 8) return "Escape";
        return defaultStrEmpty;
    }

    function getProviderType(opType?: number) {
        if (opType == 0) return "Refer-ในบัญชีเครือข่ายเดียวกัน";
        if (opType == 1) return "Refer-นอกบัญชีเครือข่ายเดียวกัน";
        if (opType == 2) return "AE-ในบัญชีเครือข่าย";
        if (opType == 3) return "AE-นอกบัญชีเครือข่าย";
        if (opType == 4) return "OP-พิการ";
        if (opType == 5) return "OP-บัตรตัวเอง";
        if (opType == 6) return "Clearing House ศบส";
        if (opType == 7) return "OP-อื่นๆ (Individual data)";
        if (opType == 8) return "ผู้ป่วยกึ่ง OP/IP (NONI)";
        if (opType == 8) return "บริการแพทย์แผนไทย";
        return defaultStrEmpty;
    }

    const getColResponsive = (key: string, children: any) => {
        return <Col key={key}
            xs={{ flex: '100%' }}
            sm={{ flex: '50%' }}
            lg={{ flex: '33.33%' }}
        >{children} </Col>
    }
    //#endregion

    return (
        <>
            <Card bordered={true} style={{ borderBottomColor: "LightGray" }} className={"MasterBackground"} >
                <Form name="workOpdEditor" layout="vertical"
                    form={formEditor}
                // onFinish={onSave}
                >
                    <Row justify="space-evenly" align="top">
                        <Col key={'hn'}
                            xs={{ flex: '100%' }}
                            sm={{ flex: '50%' }}
                            md={{ flex: '30%' }}
                            lg={{ flex: '25%' }}
                        >
                            <Space direction="vertical" align="center" size="small" >
                                <Avatar shape="square" size={64} icon={
                                    editingData?.patient.sex == 1
                                        ? <ManOutlined />
                                        : editingData?.patient.sex == 2
                                            ? <WomanOutlined rotate={45} />
                                            : <MehOutlined />
                                }
                                />
                                <Text strong keyboard >{`HN:${editingData?.opd.hn || 'N/A'}`}</Text>
                                <Text type="warning" >{moment(editingData?.opd.dateopd).format(dateDisplayFormat)}</Text>
                            </Space>
                        </Col>
                        <Col key={'hn'}
                            xs={{ flex: '100%' }}
                            sm={{ flex: '50%' }}
                            md={{ flex: '70%' }}
                            lg={{ flex: '75%' }}
                        >
                            <Row justify="start" align="middle" gutter={[4, 8]}>

                                {getColResponsive('patient',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">ชื่อ-สกุล :</Text>
                                        <Text strong>{getPatientName(editingData?.patient)}</Text>
                                    </Space>
                                )}
                                {getColResponsive('typein',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">รูปแบบ :</Text>
                                        <Text strong>{getVisitType(editingData?.opd.typein)}</Text>
                                    </Space>
                                )}
                                {getColResponsive('typeout',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">สถานะบริการ :</Text>
                                        <Text strong>{getDischargeType(editingData?.opd.typeout)}</Text>
                                    </Space>
                                )}

                                {getColResponsive('btemp',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">อุณหภูมิร่างกาย :</Text>
                                        <Text strong>{editingData?.opd.btemp || defaultStrEmpty}</Text>
                                        <Text type="secondary">°C</Text>
                                    </Space>
                                )}
                                {getColResponsive('sbp-dbp',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">ความดันโลหิต :</Text>
                                        <Text strong>{`${editingData?.opd.sbp || defaultStrEmpty}/${editingData?.opd.dbp || defaultStrEmpty}`}</Text>
                                        <Text type="secondary">mmHg</Text>
                                    </Space>
                                )}
                                {getColResponsive('pr',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">อัตราของหัวใจ :</Text>
                                        <Text strong>{editingData?.opd.pr || defaultStrEmpty}</Text>
                                        <Text type="secondary">/ min.</Text>
                                    </Space>
                                )}

                                {getColResponsive('rr',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">อัตราการหายใจ :</Text>
                                        <Text strong>{editingData?.opd.rr || defaultStrEmpty}</Text>
                                        <Text type="secondary">/ min.</Text>
                                    </Space>
                                )}
                                {getColResponsive('optype',
                                    <Space align="start" size="small" >
                                        <Text type="secondary">ประเภทการให้บริการ :</Text>
                                        <Text strong>{getProviderType(editingData?.opd.optype)}</Text>
                                    </Space>
                                )}

                                {/* <Form.Item label="Plant" name="Plant" >
                                    <Input readOnly />
                                </Form.Item> */}
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <Tabs>

            </Tabs>
        </>
    );
}

const OpdEditorPage = () => {
    return withTheme(<OpdEditor />);
}
export default OpdEditorPage;

