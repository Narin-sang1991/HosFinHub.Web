"use client";

//#region Import
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Card, Form, Row, Col,
  Tabs, Space, Typography,
  Collapse, Skeleton, Button,
  Divider, Statistic, Popconfirm,
  Tag,
  Affix
} from "antd";
import {
  IdcardOutlined, TruckOutlined, ExperimentOutlined,
  MedicineBoxOutlined, DollarOutlined,
  SaveTwoTone, CloseCircleTwoTone,
  RetweetOutlined, HistoryOutlined, CalculatorOutlined,
  WarningOutlined, CloudSyncOutlined,
  SwapOutlined
} from "@ant-design/icons";
import {
  getAsync, getResult, getStatus, getValid,
  saveAsync, saveStatus, reProcessAsync, reProcessStatus
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
import { IpdReferModel } from "@/store/refer/referModel";
import { InvoiceItemEditorModel } from "@/store/financial/invoiceItemModel";
import { AccidentEmergencyModel } from "@/store/refer/accidentEmergencyModel";
import { primaryColor } from "@/client.constant/styles..component.constant";
import withTheme from "../../../theme";
import IconSave from '@/assets/diskette.png';
import IconExit from '@/assets/logout.png'
import "@/app/globals.css";
import Image from 'next/image'
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
  const saveState = useAppSelector(saveStatus);
  const originData = useAppSelector(getResult);
  const reProcessState = useAppSelector(reProcessStatus);
  const valid: IpdValidModel[] | undefined = useAppSelector(getValid);
  const [editingData, setEditData] = useState<IpdEditorModel>();
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
      await dispatch(getAsync({ an: id }));
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
    const ipdDetail: IpdDetailModel[] = [{ ...editingData.ipdDetail, uuc: uucEditing }];
    const patData: PatientDetailModel[] = [{ ...editingData.patient }];
    const tmpVisitDetail = getVisitDetail(editingData.ipdDetail, true);
    let referData: IpdReferModel[] = [{ ...editingData.ipdRefer }];
    let aerItems: AccidentEmergencyModel[] = [];
    const aerEditor = formEditor.getFieldValue("AccidenEmergencyRefer");
    if (aerEditor != undefined) {
      aerItems = aerEditor.accidenEmergencyItems as AccidentEmergencyModel[];
      const noClaimRefer: boolean = aerItems.some(t => t.ireftype == defaultReferObjective || t.oreftype == defaultReferObjective);
      if (noClaimRefer == true) referData = [];
    }

    const savedata: IpdDataModel = {
      adp: convertEditorToAdp(invoicedata.adpItems || invoicedata.additPaymentItems),
      aer: convertEditorToAer(aerItems),
      cht: convertEditorToCht(editingData?.invoices || [], invoicedata.invoiceItems, true),
      cha: convertEditorToCha(invoicedata.invoiceItems, tmpVisitDetail, patData[0]),
      dru: convertEditorToDru(invoicedata.drugItems),
      ins: editingData?.insureItems || [],
      labfu: editingData?.labfuItems || [],
      idx: editingData?.diagnosisItems || [],
      ipd: ipdDetail,
      irf: referData,
      pat: patData,
      iop: editingData?.procedureItems || []
    };
    console.log("savedata-ipd=>", savedata);
    (async () => {
      await dispatch(saveAsync({ ...savedata }));
    })();
  }

  function onClose() {
    router.push(`/work-ipd/search`)
  }

  async function onReProcess() {
    if (editingData == undefined) return;
    (async () => {
      await dispatch(reProcessAsync({ an: editKey }));
      await dispatch(getAsync({ an: editKey }));
    })();
  }
  //#endregion

  //#region  Internal function/method
  const loadOriginalSource = () => {
    if (originData === undefined) return;

    (async () => {
      let ipdDetail = { ...originData.ipd[0] };
      let patientDetail = { ...originData.pat[0] };
      let insureDetail = { ...originData.ins[0] };
      let ipdRefer = { ...originData.irf[0] };

      let adtItems = await genarateAdditPaymentEditors(originData.adp, valid);
      let invoiceItems = await genarateAllCharges(originData.cha, valid);
      let tmpVisitDetail = getVisitDetail(ipdDetail, true);
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
        insRefercl: ipdRefer?.refer,
        referType: getReferType(ipdRefer?.refertype),
      };
      let transformData: IpdEditorModel = {
        additPayments: adtItems,
        accidenEmergencies: originData.aer,
        invoiceItems: invoiceItems,
        invoices: originData.cht,
        drugItems: genarateDrugEditors(originData.dru, valid),
        insureItems: originData.ins,
        labfuItems: originData.labfu,
        diagnosisItems: originData.idx,
        ipdDetail: ipdDetail,
        ipdRefer: ipdRefer,
        patient: patientDetail,
        procedureItems: originData.iop,
        accidenEmergencyRefer: { ...accidenEmergencyReferEditor }
      };

      setEditData(transformData);
      setVisitDetail(tmpVisitDetail);
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
        InsRefercl: ipdRefer?.refer,
        ReferType: getReferType(ipdRefer?.refertype),
        InvoiceBilling: {
          visitDetail: transformData?.ipdDetail || undefined,
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
        children: <><PatientInfoTab /> <InsureInfo isIPD={true} /></>,
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
            <DiagenosisInfo isIPD={true} diagenosisItems={editingData?.diagnosisItems || []} />
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
            <ProcedureInfo isIPD={true} procedureItems={editingData?.procedureItems || []} />
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
              icon={<DollarOutlined style={{ fontSize: '15px' }} />}
            >{"คำนวนราคา"}</Button>
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
          name="workIpdEditor"
          layout="vertical"
          form={formEditor}
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
                        />
                        <Text strong keyboard>{`HN:${editingData?.ipdDetail.hn || "N/A"
                          }`}</Text> */}
                        <Tag color="success">{`HN:${editingData?.ipdDetail.hn || "N/A"}`}</Tag>
                        <Tag color="processing">{`VN:${editingData?.ipdDetail.an || "N/A"}`}</Tag >
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
                                {`${editingData?.ipdDetail?.timeadm?.substring(0, 2)}:${editingData?.ipdDetail?.timeadm?.substring(2, 4)}`}
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
                                {`${editingData?.ipdDetail?.timedsc?.substring(0, 2)}:${editingData?.ipdDetail?.timedsc?.substring(2, 4)}`}
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

      </Skeleton>
    </>
  );
};

// const IpdEditorPage = () => {
//   return withTheme(<IpdEditor />);
// };
export default IpdEditor;
