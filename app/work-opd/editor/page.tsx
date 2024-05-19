"use client";

//#region Import
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Card, Form, Row, Col, Tabs, Space, Avatar, Typography, Collapse, Skeleton, Affix, Button, Divider, message, Input } from "antd";
import {
  ManOutlined, WomanOutlined, MehOutlined,
  IdcardOutlined, TruckOutlined, ExperimentOutlined,
  MedicineBoxOutlined, DollarOutlined,
  SaveTwoTone, CloseCircleTwoTone
} from "@ant-design/icons";
import {
  getAsync, getResult, getStatus, getValid,
  saveAsync, saveStatus,
} from "@/store/work-opd/workOpdSlice";
import type {
  OpdDataModel,
  OpdDetailModel,
  OpdEditorModel,
  OpdValidModel,
} from "@/store/work-opd/opdEditorModel";
import type { PatientDetailModel } from "@/store/patient/patientModel";
import {
  getPatientID,
  getProviderType,
  getDischargeType,
  getVisitType,
  getAgeYear,
  getMarriage,
  getPatientSex,
} from "@/client.constant/patient.constant";
import { getColResponsive } from "@/client.component/antd.col.resposive";
import { dateDisplayFormat } from "@/client.constant/format.constant";
import { additionalPaymentChargePrefix, convertEditorToCha, convertEditorToCht, genarateAllCharges } from "@/client.constant/invoice.billing.constant";
import { convertEditorToDru, genarateDrugEditors } from "@/client.constant/invoice.drug.constant";
import { convertEditorToAdp, genarateAdditPaymentEditors } from "@/client.constant/invoice.addit.payment.constant";
import { recalcAdpCharges } from "@/client.constant/invoice.additional.constant";
import PatientInfoTab from "./patient.info";
import InvoiceBillingTab from "./invoice.billing";
import InsureInfo from "./insure.info";
import withTheme from "../../../theme";
import "@/app/globals.css";
import { claimOpd } from "@/services/send.fhd.prioviver";
import ProcedureInfo from "./procedure.info";
import DiagenosisInfo from "./diagenosis.info";
//#endregion

interface OpdEditorProps { }
const defaultStrEmpty: string = "-";
const { Text } = Typography;

const OpdEditor = function OpdEditor(props: OpdEditorProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formEditor] = Form.useForm();
  const status = useAppSelector(getStatus);
  const saveState = useAppSelector(saveStatus);
  const originData = useAppSelector(getResult);
  const valid: OpdValidModel[] | undefined = useAppSelector(getValid);
  const [editingData, setEditData] = useState<OpdEditorModel>();
  const [editKey, setEditKey] = useState<any>(undefined);


  //#region Internal Effect
  useEffect(() => {
    const id = searchParams.get("id");
    if (id !== undefined) setEditKey(id);
  }, [searchParams]);

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
      let insureDetail = { ...originData.ins[0] }

      let adtItems = await genarateAdditPaymentEditors(originData.adp, valid);
      let invoiceItems = await genarateAllCharges(originData.cha, valid);

      invoiceItems = await recalcAdpCharges({
        opdData: opdDetail,
        patientData: patientDetail,
        invoiceEditors: invoiceItems,
        adtEditors: adtItems,
        reconcile: false,
        chargeCalcScope: additionalPaymentChargePrefix
      });

      let transformData: OpdEditorModel = {
        additPayments: adtItems,
        additionEmergencies: originData.aer,
        invoiceItems: invoiceItems,
        invoices: originData.cht,
        drugItems: genarateDrugEditors(originData.dru, valid),
        insureItems: originData.ins,
        labfuItems: originData.labfu,
        diagnosisItems: originData.odx,
        opdDetail: opdDetail,
        opdReferItems: originData.orf,
        patient: patientDetail,
        procedureItems: originData.oop

      };
      setEditData(transformData);

      formEditor.setFieldsValue({
        CardType: patientDetail.idtype,
        PersonID: getPatientID(patientDetail.person_id),
        AgeAtOPD: getAgeYear(patientDetail.dob, opdDetail.dateopd),
        PrefixName: patientDetail.title,
        FirstName: patientDetail.fname,
        LastName: patientDetail.lname,
        DateOfBorn: moment(patientDetail.dob).format(dateDisplayFormat),
        Nation: patientDetail.nation,
        Marriage: getMarriage(patientDetail.marriage),
        PatientSex: getPatientSex(patientDetail.sex),
        Occupation: patientDetail.occupa,
        Inscl: insureDetail.inscl,
        Premitno: insureDetail.permitno,
        UUC: opdDetail.uuc,
        SubType: insureDetail.subinscl,
        InvoiceBilling: {
          opdData: editingData?.opdDetail || undefined,
          patientData: editingData?.patient || undefined,
          invoiceItems: editingData?.invoiceItems || [],
          drugItems: editingData?.drugItems || [],
          additPaymentItems: editingData?.additPayments || [],
        }
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

  async function onSave() {

    let invoicedata = formEditor.getFieldValue("InvoiceBilling");
    // console.log("InvoiceBilling=>", invoicedata);
    if (invoicedata == undefined
      || (invoicedata.invoiceItems.length == 0
        && invoicedata.drugItems.length == 0
        && invoicedata.opdData == undefined
      )) {
      invoicedata = {
        opdData: editingData?.opdDetail || undefined,
        patientData: editingData?.patient || undefined,
        invoiceItems: editingData?.invoiceItems || [],
        drugItems: editingData?.drugItems || [],
        additPaymentItems: editingData?.additPayments || [],
      }
    }
    const uucEditing = formEditor.getFieldValue("UUC");
    // console.log("invoicedata=>", invoicedata);
    // console.log("uuc=>", uucEuucEditingditind);

    const opdData: OpdDetailModel[] = editingData != undefined ? [{ ...editingData.opdDetail, uuc: uucEditing }] : [];
    const patData: PatientDetailModel[] = editingData != undefined ? [{ ...editingData.patient }] : [];
    const savedata: OpdDataModel = {
      adp: convertEditorToAdp(invoicedata.adpItems || invoicedata.additPaymentItems),
      aer: editingData?.additionEmergencies || [],
      cht: convertEditorToCht(editingData?.invoices || [], invoicedata.invoiceItems),
      cha: convertEditorToCha(invoicedata.invoiceItems, opdData[0], patData[0]),
      dru: convertEditorToDru(invoicedata.drugItems),
      ins: editingData?.insureItems || [],
      labfu: editingData?.labfuItems || [],
      odx: editingData?.diagnosisItems || [],
      opd: opdData,
      orf: editingData?.opdReferItems || [],
      pat: patData,
      oop: editingData?.procedureItems || []
    };
    // console.log("savedata=>", savedata);
    (async () => {
      await dispatch(saveAsync({ ...savedata }));
    })();
  }

  function onClose() {
    router.push(`/work-opd/search`)
  }
  //#endregion

  //#region Internal function/method
  function getPatientName(patient?: PatientDetailModel) {
    if (patient !== undefined) {
      return `${patient.title}${patient.fname}  ${patient.lname}`;
    }
    return defaultStrEmpty;
  }

  const getCardInTab = <T extends { title: string; children: any }>(propCard: T) => {
    return (
      <Card
        key={propCard.title}
        title={propCard.title}
        style={{ width: "100%", }}
        headStyle={{ backgroundColor: "lightgray", marginBottom: "-15px" }}
      >
        {propCard.children}
      </Card>
    );
  };

  const tabItems = [
    {
      key: "patientInfo",
      label: "ข้อมูลทั่วไป",
      icon: <IdcardOutlined />,
      children: getCardInTab({
        title: "ข้อมูลผู้ป่วย",
        children: <div><PatientInfoTab /> <InsureInfo /></div>,
      }),
    },
    {
      key: "refer",
      label: "อุบัติเหตุ/ส่งต่อ",
      icon: <TruckOutlined />,
      children: "Content of Tab Pane 2",
    },
    {
      key: "diagnosis",
      label: "การวินิจฉัยโรค",
      icon: <ExperimentOutlined />,
      children: getCardInTab({
        title: "ข้อมูลการวินิจฉัยโรค",
        children: (
          <Form.Item name={"procedureInfo"}>
            <DiagenosisInfo diagenosisInfo={editingData?.diagnosisItems || []} />
          </Form.Item>
        )
      }),
    },
    {
      key: "operate",
      label: "การผ่าตัดหัตถการ",
      icon: <MedicineBoxOutlined />,
      children: getCardInTab({
        title: "ข้อมูลการผ่าตัดหัตถการ",
        children: (
          <Form.Item name={"procedureInfo"}>
            <ProcedureInfo procedureInfo={editingData?.procedureItems || []} />
          </Form.Item>
        )
      })
    },
    {
      key: "billing",
      label: "ค่ารักษาพยาบาล",
      icon: <DollarOutlined />,
      children: getCardInTab({
        title: "ข้อมูลค่ารักษาพยาบาล",
        children: (
          <Form.Item name={"InvoiceBilling"}>
            <InvoiceBillingTab opdData={editingData?.opdDetail || undefined}
              patientData={editingData?.patient || undefined}
              invoiceItems={editingData?.invoiceItems || []}
              drugItems={editingData?.drugItems || []}
              additPaymentItems={editingData?.additPayments || []}
            />
          </Form.Item>
        ),
      }),
    },
  ];
  //#endregion

  return (
    <Skeleton active loading={status === "loading"} >
      <Space size={"small"} direction="vertical" align="end">
        <Affix offsetTop={50}  >
          <Row style={{ margin: -10, marginBottom: 10 }} justify="end" align="middle" gutter={[4, 4]}>
            <Col>
              <Button type="text" onClick={onSave} loading={saveState === "loading"}
                icon={<SaveTwoTone twoToneColor={'#52c41a'} style={{ fontSize: '30px' }} />}
              />
            </Col>
            <Col> <Divider type="vertical" style={{ height: 20 }} /> </Col>
            <Col>
              <Button type="text" onClick={onClose}
                icon={<CloseCircleTwoTone twoToneColor={'#f5222d'} style={{ fontSize: '30px' }} />}
              />
            </Col>
          </Row>
        </Affix>
        <Form
          name="workOpdEditor"
          layout="vertical"
          form={formEditor}
        >
          <Collapse
            size="small"
            style={{ margin: -10, marginBottom: 5 }}
            items={[
              {
                key: "1",
                label: (
                  <Row justify="start" align="middle" gutter={[4, 8]}>
                    {getColResponsive({
                      key: "patient",
                      children: (
                        <Space align="start" size="small">
                          <Text type="secondary">ชื่อ-สกุล :</Text>
                          <Text strong>
                            {getPatientName(editingData?.patient)}
                          </Text>
                        </Space>
                      ),
                    })}
                    {getColResponsive({
                      key: "typein",
                      children: (
                        <Space align="start" size="small">
                          <Text type="secondary">รูปแบบ :</Text>
                          <Text strong>
                            {getVisitType(editingData?.opdDetail.typein)}
                          </Text>
                        </Space>
                      ),
                    })}
                    {getColResponsive({
                      key: "typeout",
                      children: (
                        <Space align="start" size="small">
                          <Text type="secondary">สถานะบริการ :</Text>
                          <Text strong>
                            {getDischargeType(editingData?.opdDetail.typeout)}
                          </Text>
                        </Space>
                      ),
                    })}
                  </Row>
                ),
                children: (
                  <Row justify="space-around" align="top">
                    <Col
                      key={"hn"}
                      xs={{ flex: "100%" }}
                      sm={{ flex: "20%" }}
                      md={{ flex: "18%" }}
                      lg={{ flex: "13%" }}
                    >
                      <Space direction="vertical" align="center" size="small">
                        <Avatar
                          shape="square"
                          size={48}
                          icon={
                            editingData?.patient.sex == 1 ? (
                              <ManOutlined />
                            ) : editingData?.patient.sex == 2 ? (
                              <WomanOutlined rotate={45} />
                            ) : (
                              <MehOutlined />
                            )
                          }
                        />
                        <Text strong keyboard>{`HN:${editingData?.opdDetail.hn || "N/A"
                          }`}</Text>
                      </Space>
                    </Col>
                    <Col
                      key={"patient"}
                      xs={{ flex: "100%" }}
                      sm={{ flex: "80%" }}
                      md={{ flex: "82%" }}
                      lg={{ flex: "87%" }}
                    >
                      <Row justify="start" align="middle" gutter={[4, 8]}>
                        {getColResponsive({
                          key: "btemp",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">อุณหภูมิร่างกาย :</Text>
                              <Text strong>
                                {editingData?.opdDetail.btemp || defaultStrEmpty}
                              </Text>
                              <Text type="secondary">°C</Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "sbp-dbp",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">ความดันโลหิต :</Text>
                              <Text strong>{`${editingData?.opdDetail.sbp || defaultStrEmpty
                                }/${editingData?.opdDetail.dbp || defaultStrEmpty
                                }`}</Text>
                              <Text type="secondary">mmHg</Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "pr",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">อัตราของหัวใจ :</Text>
                              <Text strong>
                                {editingData?.opdDetail.pr || defaultStrEmpty}
                              </Text>
                              <Text type="secondary">/ min.</Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "rr",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">อัตราการหายใจ :</Text>
                              <Text strong>
                                {editingData?.opdDetail.rr || defaultStrEmpty}
                              </Text>
                              <Text type="secondary">/ min.</Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "optype",
                          span: 2,
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">ประเภทการให้บริการ :</Text>
                              <Text strong>
                                {getProviderType(editingData?.opdDetail.optype)}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "rr",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">วันที่รับบริการ :</Text>
                              <Text type="warning">
                                {moment(editingData?.opdDetail.dateopd).format(
                                  dateDisplayFormat
                                )}
                              </Text>
                            </Space>
                          ),
                        })}
                      </Row>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
          <Tabs items={tabItems} />
        </Form>
      </Space>
    </Skeleton>
  );
};

const OpdEditorPage = () => {
  return withTheme(<OpdEditor />);
};
export default OpdEditorPage;
