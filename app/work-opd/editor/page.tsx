"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Tabs,
  Space,
  Avatar,
  Typography,
  Collapse,
} from "antd";
import {
  ManOutlined,
  WomanOutlined,
  MehOutlined,
  IdcardOutlined,
  TruckOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import withTheme from "../../../theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getAsync,
  getResult,
  getStatus,
  getValid,
} from "@/store/work-opd/workOpdSlice";
import type {
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
import { genarateAllCharges } from "@/client.constant/invoice.billing.constant";
import { genarateDrugEditors } from "@/client.constant/invoice.drug.constant";
import PatientInfoTab from "./patient.info";
import InvoiceBillingTab from "./invoice.billing";
import "@/app/globals.css";

interface OpdEditorProps {}
const defaultStrEmpty: string = "-";
const { Text } = Typography;

const OpdEditor = function OpdEditor(props: OpdEditorProps) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [formEditor] = Form.useForm();
  const status = useAppSelector(getStatus);
  const originData = useAppSelector(getResult);
  const valid: OpdValidModel[] | undefined = useAppSelector(getValid);
  const [editingData, setEditData] = useState<OpdEditorModel>();
  const [editKey, setEditKey] = useState<any>(undefined);

  //#region Internal Effect
  useEffect(() => {
    const id = searchParams.get("id");
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
        invoiceItems: genarateAllCharges(originData.cha, valid),
        drugItems: genarateDrugEditors(originData.dru, valid),
      };
      setEditData(transformData);

      await formEditor.setFieldsValue({
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
      return `${patient.title}${patient.fname}  ${patient.lname}`;
    }
    return defaultStrEmpty;
  }

  const getCardInTab = <T extends { title: string; children: any }>(
    propCard: T
  ) => {
    return (
      <Card
        title={propCard.title}
        style={{ width: "100%" }}
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
        children: <PatientInfoTab />,
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
      children: "Content of Tab Pane 3",
    },
    {
      key: "operate",
      label: "การผ่าตัดหัตถการ",
      icon: <MedicineBoxOutlined />,
      children: "Content of Tab Pane 4",
    },
    {
      key: "billing",
      label: "ค่ารักษาพยาบาล",
      icon: <DollarOutlined />,
      children: getCardInTab({
        title: "ข้อมูลค่ารักษาพยาบาล",
        children: (
          <InvoiceBillingTab
            invoiceItems={editingData?.invoiceItems || []}
            drugItems={editingData?.drugItems || []}
          />
        ),
      }),
    },
  ];
  //#endregion

  return (
    <>
      <Form
        name="workOpdEditor"
        layout="vertical"
        form={formEditor}
        // onFinish={onSave}
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
                          {getVisitType(editingData?.opd.typein)}
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
                          {getDischargeType(editingData?.opd.typeout)}
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
                      <Text strong keyboard>{`HN:${
                        editingData?.opd.hn || "N/A"
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
                              {editingData?.opd.btemp || defaultStrEmpty}
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
                            <Text strong>{`${
                              editingData?.opd.sbp || defaultStrEmpty
                            }/${
                              editingData?.opd.dbp || defaultStrEmpty
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
                              {editingData?.opd.pr || defaultStrEmpty}
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
                              {editingData?.opd.rr || defaultStrEmpty}
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
                              {getProviderType(editingData?.opd.optype)}
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
                              {moment(editingData?.opd.dateopd).format(
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
    </>
  );
};

const OpdEditorPage = () => {
  return withTheme(<OpdEditor />);
};
export default OpdEditorPage;
