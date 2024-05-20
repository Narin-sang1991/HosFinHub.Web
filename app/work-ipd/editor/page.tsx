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
  // saveAsync, saveStatus,
} from "@/store/work-ipd/workIpdSlice";
import type {
  IpdDataModel,
  IpdDetailModel,
  IpdEditorModel,
  IpdValidModel,
} from "@/store/work-ipd/ipdEditorModel";
import type { PatientDetailModel } from "@/store/patient/patientModel";
import {
  getPatientID,
  getDischargeIPD,
  getAgeYear,
  getMarriage,
  getPatientSex,
  getAdmitType,
  getDischargeStatus,
} from "@/client.constant/patient.constant";
import { getColResponsive } from "@/client.component/antd.col.resposive";
import { dateDisplayFormat, timeDisplayFormat } from "@/client.constant/format.constant";
import { additionalPaymentChargePrefix, convertEditorToCha, convertEditorToCht, genarateAllCharges } from "@/client.constant/invoice.billing.constant";
import { convertEditorToDru, genarateDrugEditors } from "@/client.constant/invoice.drug.constant";
import { convertEditorToAdp, genarateAdditPaymentEditors } from "@/client.constant/invoice.addit.payment.constant";
import { recalcAdpCharges } from "@/client.constant/invoice.additional.constant";

// import InvoiceBillingTab from "./invoice.billing";
import PatientInfoTab from "@/app/work-sub-component/patient.info";
import InsureInfo from "@/app/work-sub-component/insure.info";
import ProcedureInfo from "@/app/work-sub-component/procedure.info";
import DiagenosisInfo from "@/app/work-sub-component/diagenosis.info";
import AccidentEmergencyTab from "@/app/work-sub-component/accident.emergency";
import ReferInfo from "@/app/work-sub-component/refer.info";
import { IpdReferModel } from "@/store/refer/referModel";
import withTheme from "../../../theme";
import "@/app/globals.css";
//#endregion

interface IpdEditorProps { }
const defaultStrEmpty: string = "-";
const { Text } = Typography;

const IpdEditor = function IpdEditor(props: IpdEditorProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formEditor] = Form.useForm();
  const status = useAppSelector(getStatus);
  // const saveState = useAppSelector(saveStatus);
  const originData = useAppSelector(getResult);
  const valid: IpdValidModel[] | undefined = useAppSelector(getValid);
  const [editingData, setEditData] = useState<IpdEditorModel>();
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
      let ipdDetail = { ...originData.ipd[0] };
      let patientDetail = { ...originData.pat[0] };
      let insureDetail = { ...originData.ins[0] };
      let ipdRefer = { ...originData.irf[0] };

      // let adtItems = await genarateAdditPaymentEditors(originData.adp, valid);
      let invoiceItems = await genarateAllCharges(originData.cha, valid);

      // invoiceItems = await recalcAdpCharges({
      //   visitDetail: ipdDetail,
      //   patientData: patientDetail,
      //   invoiceEditors: invoiceItems,
      //   adtEditors: adtItems,
      //   reconcile: false,
      //   chargeCalcScope: additionalPaymentChargePrefix
      // });

      let transformData: IpdEditorModel = {
        // additPayments: adtItems,
        accidenEmergencies: originData.aer,
        invoiceItems: invoiceItems,
        invoices: originData.cht,
        // drugItems: genarateDrugEditors(originData.dru, valid),
        insureItems: originData.ins,
        labfuItems: originData.labfu,
        diagnosisItems: originData.idx,
        ipdDetail: ipdDetail,
        ipdRefer: ipdRefer,
        patient: patientDetail,
        procedureItems: originData.iop

      };
      console.log("transformData=>", transformData);
      setEditData(transformData);

      formEditor.setFieldsValue({
        CardType: patientDetail.idtype,
        PersonID: getPatientID(patientDetail.person_id),
        AgeAtVisitDate: getAgeYear(patientDetail.dob, ipdDetail.dateadm),
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
        UUC: ipdDetail.uuc,
        SubType: insureDetail.subinscl,
        InvoiceBilling: {
          opdData: editingData?.ipdDetail || undefined,
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
      await dispatch(getAsync({ an: id }));
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
        visitDetail: editingData?.ipdDetail || undefined,
        patientData: editingData?.patient || undefined,
        invoiceItems: editingData?.invoiceItems || [],
        drugItems: editingData?.drugItems || [],
        additPaymentItems: editingData?.additPayments || [],
      }
    }
    const uucEditing = formEditor.getFieldValue("UUC");
    // console.log("invoicedata=>", invoicedata);
    // console.log("uuc=>", uucEuucEditingditind);

    const visitDetail: IpdDetailModel[] = editingData != undefined ? [{ ...editingData.ipdDetail, uuc: uucEditing }] : [];
    const patData: PatientDetailModel[] = editingData != undefined ? [{ ...editingData.patient }] : [];
    const referData: IpdReferModel[] = editingData != undefined ? [{ ...editingData.ipdRefer }] : [];
    const savedata: IpdDataModel = {
      adp: convertEditorToAdp(invoicedata.adpItems || invoicedata.additPaymentItems),
      aer: editingData?.accidenEmergencies || [],
      cht: convertEditorToCht(editingData?.invoices || [], invoicedata.invoiceItems),
      cha: convertEditorToCha(invoicedata.invoiceItems, visitDetail[0], patData[0]),
      dru: convertEditorToDru(invoicedata.drugItems),
      ins: editingData?.insureItems || [],
      labfu: editingData?.labfuItems || [],
      idx: editingData?.diagnosisItems || [],
      ipd: visitDetail,
      irf: referData,
      pat: patData,
      iop: editingData?.procedureItems || []
    };
    // console.log("savedata=>", savedata);
    // (async () => {
    //   await dispatch(saveAsync({ ...savedata }));
    // })();
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
        children: <><PatientInfoTab /> <InsureInfo /></>,
      }),
    },
    {
      key: "refer",
      label: "อุบัติเหตุ/ส่งต่อ",
      icon: <TruckOutlined />,
      children: getCardInTab({
        title: "ข้อมูลอุบัติเหตุ ฉุกเฉิน และรับส่ง เพื่อรักษา",
        children: (
          <>
            <AccidentEmergencyTab accidentEmergencies={editingData?.accidenEmergencies || []} />
            <ReferInfo />
          </>
        )
      }),
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
        children: (<></>
          // <Form.Item name={"procedureInfo"}>
          //   <ProcedureInfo procedureInfo={editingData?.procedureItems || []} />
          // </Form.Item>
        )
      })
    },
    {
      key: "billing",
      label: "ค่ารักษาพยาบาล",
      icon: <DollarOutlined />,
      children: getCardInTab({
        title: "ข้อมูลค่ารักษาพยาบาล",
        children: (<></>
          // <Form.Item name={"InvoiceBilling"}>
          //   <InvoiceBillingTab opdData={editingData?.ipdDetail || undefined}
          //     patientData={editingData?.patient || undefined}
          //     invoiceItems={editingData?.invoiceItems || []}
          //     drugItems={editingData?.drugItems || []}
          //     additPaymentItems={editingData?.additPayments || []}
          //   />
          // </Form.Item>
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
            {/* <Col>
              <Button type="text" onClick={onSave} loading={saveState === "loading"}
                icon={<SaveTwoTone twoToneColor={'#52c41a'} style={{ fontSize: '30px' }} />}
              />
            </Col> */}
            <Col> <Divider type="vertical" style={{ height: 20 }} /> </Col>
            <Col>
              <Button type="text" onClick={onClose}
                icon={<CloseCircleTwoTone twoToneColor={'#f5222d'} style={{ fontSize: '30px' }} />}
              />
            </Col>
          </Row>
        </Affix>
        <Form
          name="workIpdEditor"
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
                      key: "svctype",
                      children: (
                        <Space align="start" size="small">
                          <Text type="secondary">ประเภทการ admit :</Text>
                          <Text strong>
                            {getAdmitType(editingData?.ipdDetail.svctype)}
                          </Text>
                        </Space>
                      ),
                    })}
                    {getColResponsive({
                      key: "dischs",
                      children: (
                        <Space align="start" size="small">
                          <Text type="secondary">สถานภาพการจำหน่าย :</Text>
                          <Text strong>
                            {getDischargeStatus(editingData?.ipdDetail.dischs)}
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
                        <Text strong keyboard>{`HN:${editingData?.ipdDetail.hn || "N/A"
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
                          key: "adm_w",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">น้ำหนัก admit :</Text>
                              <Text strong>
                                {editingData?.ipdDetail?.adm_w ?? defaultStrEmpty}
                              </Text>
                              <Text type="secondary">กิโลกรัม</Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "dateadm",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">วันที่ admit :</Text>
                              <Text type="warning">
                                {moment(editingData?.ipdDetail.dateadm).format(
                                  dateDisplayFormat
                                )}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "timeadm",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">เวลา admit :</Text>
                              <Text type="warning">
                                {`${editingData?.ipdDetail.timeadm.substring(0, 2)}:${editingData?.ipdDetail.timeadm.substring(2, 4)}`}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "discht",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">วิธีการจำหน่าย :</Text>
                              <Text strong>
                                {getDischargeIPD(editingData?.ipdDetail.discht)}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "datedsc",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">วันที่จำหน่าย :</Text>
                              <Text type="warning">
                                {moment(editingData?.ipdDetail.datedsc).format(
                                  dateDisplayFormat
                                )}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "timedsc",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">เวลาจำหน่าย :</Text>
                              <Text type="warning">
                                {`${editingData?.ipdDetail.timedsc.substring(0, 2)}:${editingData?.ipdDetail.timedsc.substring(2, 4)}`}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "dept",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">แผนก :</Text>
                              <Text strong>
                                {`Ward ${editingData?.ipdDetail.dept}`}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "warddsc",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">รหัสตึก :</Text>
                              <Text strong>
                                {editingData?.ipdDetail.warddsc}
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

const IpdEditorPage = () => {
  return withTheme(<IpdEditor />);
};
export default IpdEditorPage;
