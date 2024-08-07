"use client";

//#region Import
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Image from 'next/image'
import { Card, Form, Row, Col, Tabs, Space, Typography, Collapse, Skeleton, Button, Divider, Statistic, Popconfirm, Tag, Affix } from "antd";
import {
  SwapOutlined, IdcardOutlined, TruckOutlined, ExperimentOutlined,
  MedicineBoxOutlined, DollarOutlined,
  RetweetOutlined, HistoryOutlined, CalculatorOutlined,
  WarningOutlined
} from "@ant-design/icons";
import {
  getAsync, getResult, getStatus, getValid,
  saveAsync, saveStatus, reProcessAsync, reProcessStatus
} from "@/store/work-opd/workOpdSlice";
import type { OpdDataModel, OpdDetailModel, OpdEditorModel, OpdValidModel } from "@/store/work-opd/opdEditorModel";
import type { PatientDetailModel } from "@/store/patient/patientModel";
import {
  getPatientID,
  getProviderType,
  getDischargeOPD,
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
import { getReferType, getVisitDetail } from "@/client.constant/work.editor.constant";
import { getPatientFullName } from "@/client.constant/work.search.constant";
import { convertEditorToAer, defaultReferObjective } from "@/client.constant/emergency.refer.constant";

import PatientInfoTab from "@/app/work-sub-component/patient.info";
import InsureInfo from "@/app/work-sub-component/insure.info";
import ProcedureInfo from "@/app/work-sub-component/procedure.info";
import DiagenosisInfo from "@/app/work-sub-component/diagenosis.info";
import AccidentEmergencyTab from "@/app/work-sub-component/accident.emergency";
import InvoiceBillingTab from "@/app/work-sub-component/invoice.billing";
import { VisitDetailModel } from "@/store/work/workEditorModel";
import { OpdReferModel } from "@/store/refer/referModel";
import { InvoiceItemEditorModel } from "@/store/financial/invoiceItemModel";
import { AccidentEmergencyModel } from "@/store/refer/accidentEmergencyModel";
import { primaryColor } from "@/client.constant/styles..component.constant";
import withTheme from "../../../theme";
import "@/app/globals.css";
import IconSave from '@/assets/diskette.png';
import IconExit from '@/assets/logout.png'

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
  const reProcessState = useAppSelector(reProcessStatus);
  const valid: OpdValidModel[] | undefined = useAppSelector(getValid);
  const [editingData, setEditData] = useState<OpdEditorModel>();
  const [editKey, setEditKey] = useState<any>(undefined);
  const [visitDetail, setVisitDetail] = useState<VisitDetailModel>();
  const [originTotalInvoice, setOriginTotalInvoice] = useState<number>(0);
  const [totalInvoice, setTotalInvoice] = useState<{ totalAmount: number, overAmount: number }>();
  const firstLoad = useRef(true)

  //#region Internal Effect
  useEffect(() => {
    const id = searchParams.get("id");
    let tmpEditKey = editKey;
    // console.log('id :', id);
    if (id !== undefined) setEditKey(id);
    // console.log('tmpEditKey :', tmpEditKey);
    if (id !== tmpEditKey) firstLoad.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (editKey !== undefined) {
      formEditor.resetFields();
      onGet(editKey);
    }
  }, [editKey]);

  useEffect(() => {
    reCalculation();
  }, [editingData]);

  useEffect(() => {
    loadOriginalSource();
  }, [originData]);
  //#endregion

  //#region Async
  async function onGet(id: any) {
    (async () => {
      await dispatch(getAsync({ seq: id }));
    })();
  }

  async function onSave() {
    if (editingData == undefined) return;
    await formEditor.validateFields();

    let invoicedata = formEditor.getFieldValue("InvoiceBilling");
    // console.log("InvoiceBilling=>", invoicedata);
    if (invoicedata == undefined
      || (invoicedata.invoiceItems.length == 0
        && invoicedata.drugItems.length == 0
        && invoicedata.opdData == undefined
      )) {
      invoicedata = {
        invoiceItems: editingData.invoiceItems,
        drugItems: editingData.drugItems,
        additPaymentItems: editingData.additPayments,
      }
    }

    const uucEditing = formEditor.getFieldValue("UUC");
    const optypeEditing = formEditor.getFieldValue("OpType");
    const opdDetail: OpdDetailModel[] = [{
      ...editingData.opdDetail,
      uuc: uucEditing,
      optype: optypeEditing,
    }];
    const patData: PatientDetailModel[] = [{ ...editingData.patient }];
    const tmpVisitDetail = getVisitDetail(editingData.opdDetail, false);
    let referData: OpdReferModel[] = [{ ...editingData.opdRefer }];
    let aerItems: AccidentEmergencyModel[] = [];
    const aerEditor = formEditor.getFieldValue("AccidenEmergencyRefer");
    if (aerEditor != undefined) {
      aerItems = aerEditor.accidenEmergencyItems as AccidentEmergencyModel[];
      const noClaimRefer: boolean = aerItems.some(t => t.ireftype == defaultReferObjective || t.oreftype == defaultReferObjective);
      if (noClaimRefer == true) referData = [];
    }

    const savedata: OpdDataModel = {
      adp: convertEditorToAdp(invoicedata.adpItems || invoicedata.additPaymentItems),
      aer: convertEditorToAer(aerItems),
      cht: convertEditorToCht(editingData?.invoices || [], invoicedata.invoiceItems, false),
      cha: convertEditorToCha(invoicedata.invoiceItems, tmpVisitDetail, patData[0]),
      dru: convertEditorToDru(invoicedata.drugItems),
      ins: editingData?.insureItems || [],
      labfu: editingData?.labfuItems || [],
      odx: editingData?.diagnosisItems || [],
      opd: opdDetail,
      orf: referData,
      pat: patData,
      oop: editingData?.procedureItems || []
    };
    console.log("savedata-opd=>", savedata);
    (async () => {
      await dispatch(saveAsync({ ...savedata }));
    })();
  }

  function onClose() {
    router.push(`/work-opd/search`)
  }

  async function onReProcess() {
    if (editingData == undefined) return;
    (async () => {
      await dispatch(reProcessAsync({ seq: editKey }));
      await dispatch(getAsync({ seq: editKey }));
    })();
  }
  //#endregion

  //#region  Internal function/method
  const loadOriginalSource = () => {
    if (originData === undefined) return;

    (async () => {
      let opdDetail = { ...originData.opd[0] };
      let patientDetail = { ...originData.pat[0] };
      let insureDetail = { ...originData.ins[0] };
      let opdRefer = { ...originData.orf[0] };

      let adtItems = await genarateAdditPaymentEditors(originData.adp, valid);
      let invoiceItems = await genarateAllCharges(originData.cha, valid);
      let tmpVisitDetail = getVisitDetail(opdDetail, false);
      invoiceItems = await recalcAdpCharges({
        visitDetail: tmpVisitDetail,
        patientData: patientDetail,
        invoiceEditors: invoiceItems,
        adtEditors: adtItems,
        reconcile: false,
        chargeCalcScope: additionalPaymentChargePrefix
      });
      let accidenEmergencyReferEditor = {
        accidenEmergencyItems: originData.aer,
        insRefercl: opdRefer?.refer,
        referType: getReferType(opdRefer?.refertype),
        referDate: opdRefer?.referdate
          ? moment(opdRefer?.referdate).format(dateDisplayFormat
          ) : "",
      };
      let transformData: OpdEditorModel = {
        additPayments: adtItems,
        accidenEmergencies: originData.aer,
        invoiceItems: invoiceItems,
        invoices: originData.cht,
        drugItems: genarateDrugEditors(originData.dru, valid),
        insureItems: originData.ins,
        labfuItems: originData.labfu,
        diagnosisItems: originData.odx,
        opdDetail: opdDetail,
        opdRefer: opdRefer,
        patient: patientDetail,
        procedureItems: originData.oop,
        accidenEmergencyRefer: { ...accidenEmergencyReferEditor }
      };

      setEditData(transformData);
      setVisitDetail(tmpVisitDetail);
      formEditor.setFieldsValue({
        CardType: patientDetail.idtype,
        PersonID: getPatientID(patientDetail.person_id),
        AgeAtVisitDate: getAgeYear(patientDetail.dob, opdDetail.dateopd),
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
        OpType: opdDetail.optype,
        SubType: insureDetail.subinscl,
        InvoiceBilling: {
          visitDetail: transformData?.opdDetail || undefined,
          patientData: transformData?.patient || undefined,
          invoiceItems: transformData?.invoiceItems || [],
          drugItems: transformData?.drugItems || [],
          additPaymentItems: transformData?.additPayments || [],
        },
        AccidenEmergencyRefer: { ...accidenEmergencyReferEditor }
      });
    })();
  }

  const reCalculation = () => {
    if (editingData == undefined) return;

    if (firstLoad.current === true) {
      firstLoad.current = false;
      let originTotalInvoice = originData?.cha.map(a => a.amount).reduce(function (a, b) {
        return Number(a.toString()) + Number(b.toString());
      }, 0);
      setOriginTotalInvoice(originTotalInvoice || 0);
      setTotalInvoice(undefined);
    } else {
      let invoiceBilling = formEditor.getFieldValue("InvoiceBilling");
      if (invoiceBilling == undefined) return;

      let invoiceItems = invoiceBilling.invoiceItems as InvoiceItemEditorModel[];
      if (invoiceItems == undefined) return;

      if (invoiceItems.length > 0) {
        let total = invoiceItems.map(a => a.totalAmount).reduce(function (a, b) {
          return Number(a.toString()) + Number(b.toString());
        });
        let totalOver = invoiceItems.map(a => a.overAmount).reduce(function (a, b) {
          return Number(a.toString()) + Number(b.toString());
        });
        setTotalInvoice({
          totalAmount: total,
          overAmount: totalOver
        });
      } else setTotalInvoice(undefined);
    }
  }
  //#endregion

  //#region Internal Const-UI
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
        children: <><PatientInfoTab /> <InsureInfo isIPD={false} /></>,
      }),
    },
    {
      key: "refer",
      label: "อุบัติเหตุ/ส่งต่อ",
      icon: <TruckOutlined />,
      children: getCardInTab({
        title: "ข้อมูลอุบัติเหตุ ฉุกเฉิน และรับส่ง เพื่อรักษา",
        children: (
          <Form.Item name={"AccidenEmergencyRefer"}>
            <AccidentEmergencyTab {...editingData?.accidenEmergencyRefer} visitDetail={visitDetail} />
          </Form.Item>
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
            <DiagenosisInfo isIPD={false} diagenosisItems={editingData?.diagnosisItems || []} />
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
            <ProcedureInfo isIPD={false} procedureItems={editingData?.procedureItems || []} />
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
            <InvoiceBillingTab visitDetail={visitDetail}
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
    <>
      <Row justify="space-between" align="middle" gutter={[4, 4]}>
        <Col>
          <Space>
            <Button type="primary" shape="round" ghost
              onClick={reCalculation} disabled={status === "loading" || saveState === "loading" || reProcessState === "loading"}
              icon={<DollarOutlined style={{ fontSize: '14px' }} />}>{"คำนวนราคา"}</Button>
            <Divider type="vertical" style={{ height: 20 }} />
            <Statistic value={originTotalInvoice}
              title="จำนวนเงินตั้งต้น" precision={2}
              valueStyle={{ color: 'gray' }}
              prefix={<HistoryOutlined />}
              suffix="บาท" />
            <Divider type="vertical" style={{ height: 20 }} />
            <Statistic value={totalInvoice ? totalInvoice.totalAmount : '-'}
              title="รวมเงินขอเบิก" precision={2}
              valueStyle={{ color: primaryColor }}
              prefix={totalInvoice ? <CalculatorOutlined /> : ''}
              suffix={totalInvoice ? "บาท" : ''} />
            <Divider type="vertical" style={{ height: 20 }} />
            <Statistic value={totalInvoice ? totalInvoice.overAmount : '-'}
              title="รวมเบิกไม่ได้" precision={2}
              valueStyle={{ color: '#dfa111' }}
              prefix={totalInvoice ? <WarningOutlined /> : ''}
              suffix={totalInvoice ? "บาท" : ''} />
          </Space>
        </Col>
        <Col>
          <Affix offsetTop={0}>
            <Card size="small" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '10px' }}>
              <Space>
                <Popconfirm okText="ใช่" cancelText="ไม่"
                  title="แน่ใจการดึงข้อมูลจากHISใหม่?"
                  placement="bottom"
                  onConfirm={onReProcess}
                >
                  <Button type="dashed" loading={reProcessState === "loading"}
                    disabled={status === "loading" || saveState === "loading"}

                    icon={<SwapOutlined />}
                  >{"โหลดข้อมูลใหม่"}</Button>
                </Popconfirm>
                <Divider type="vertical" style={{ height: 20 }} />
                <Card
                  hoverable
                  bordered
                  bodyStyle={{ marginBottom: '-25px' }}
                  onClick={onSave}
                  size="small"
                  cover={
                    <Image
                      style={{ borderRadius: '1px' }}
                      src={IconSave}
                      width={25}
                      alt="Picture of the Exit"
                    />
                  }
                >
                </Card>
                <Divider type="vertical" style={{ height: 20 }} />
                <Card
                  hoverable
                  bodyStyle={{ marginBottom: '-25px' }}
                  onClick={onClose}
                  size="small"
                  cover={
                    <Image
                      style={{ borderRadius: '1px' }}
                      src={IconExit}
                      width={30}
                      alt="Picture of the Exit"
                    />
                  }
                >
                </Card>
              </Space>
            </Card>
          </Affix>
        </Col>
      </Row>
      <Skeleton active loading={status === "loading" || saveState === "loading" || reProcessState === "loading"} >
        <Form
          name="workOpdEditor"
          layout="vertical"
          form={formEditor}
          size="small"
        >
          <Collapse
            size="small"
            activeKey={'1'}
            style={{ margin: 5 }}
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
                            {getPatientFullName(editingData?.patient)}
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
                            {getDischargeOPD(editingData?.opdDetail.typeout)}
                          </Text>
                        </Space>
                      ),
                    })}
                  </Row>
                ),
                children: (
                  <Row justify="space-around" align="middle">
                    <Col
                      key={"hn"}
                      xs={{ flex: "100%" }}
                      sm={{ flex: "20%" }}
                      md={{ flex: "18%" }}
                      lg={{ flex: "13%" }}
                    >
                      <Space direction="vertical" align="center" size="middle">
                        {/* <Avatar
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
                        /> */}
                        <Tag color="success">{`HN:${editingData?.opdDetail.hn || "N/A"}`}</Tag >
                        <Tag color="processing">{`VN:${editingData?.opdDetail.seq || "N/A"}`}</Tag >
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
                              <Text type="success">
                                {moment(editingData?.opdDetail.dateopd).format(
                                  dateDisplayFormat
                                )}
                              </Text>
                            </Space>
                          ),
                        })}
                        {getColResponsive({
                          key: "rr",
                          children: (
                            <Space align="start" size="small">
                              <Text type="secondary">เวลาเข้ารับบริการ :</Text>
                              <Text type="success">
                                {/* {moment(editingData?.opdDetail.dateopd).format(
                                  dateDisplayFormat
                                )} */}
                                {(editingData?.opdDetail.timeopd.substring(0, 2) + ':' + editingData?.opdDetail.timeopd.substring(2, 4))}
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
          <Tabs items={tabItems} size="small" />
        </Form>
      </Skeleton >
    </>
  );
};

// const OpdEditorPage = () => {
//   return withTheme(<OpdEditor />);
// };
export default OpdEditor;
