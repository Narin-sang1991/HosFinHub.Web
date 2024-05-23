"use client";

//#region Import
import React, { useState, useEffect } from "react";
import { Button, Typography, Table, Statistic, Modal, Tag, Badge, Form, Space, } from "antd";
import type { TableColumnsType } from "antd";
import { FileDoneOutlined, FileExclamationTwoTone } from "@ant-design/icons";
import { InvoiceItemEditorModel, InvoiceItemModel } from "@/store/financial/invoiceItemModel";
import { AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import type { InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import { MoveInvoiceItemModel } from "@/store/financial/moveItemModel";
import { getStatusDisplayType, getClaimStatusText, drugFileCode, drugInChargePrefix, drugExChargePrefix, additionalPaymentChargePrefix, getChargeText, allChargeItems, getChargeTypes } from "@/client.constant/invoice.billing.constant";
import { getAdpDisplay } from "@/client.constant/invoice.addit.payment.constant";
import InvoiceDrugPage from "./invoice.drug";
import InvoiceAdditionalPage from "./invoice.additional";
import { adpTypeNonGroup, recalcAdpCharges } from "@/client.constant/invoice.additional.constant";
import { recalcDrugCharges } from "@/client.constant/invoice.drug.constant";
import { PatientDetailModel } from "@/store/patient/patientModel";
import { VisitDetailModel } from "@/store/work/workEditorModel";
import { ChargeModel } from "@/store/financial/chargeModel";
import "@/app/globals.css";
//#endregion

type InvoiceBillingProps = {
  visitDetail?: VisitDetailModel,
  patientData?: PatientDetailModel,
  invoiceItems: InvoiceItemEditorModel[],
  drugItems: InvoiceDrugEditorModel[],
  additPaymentItems?: AdditPaymentModelEditorModel[],
  onChange?: any,
};
const { Text } = Typography;
const defaultCharge: ChargeModel = { prefix: "", name: "", chargeTypes: [] };
const InvoiceBillingTab = function InvoiceBilling({ visitDetail, patientData, invoiceItems, drugItems, additPaymentItems, onChange, }: InvoiceBillingProps) {

  const [formBillingEditor] = Form.useForm();
  const [invoiceData, setInvoiceData] = useState<InvoiceItemEditorModel[]>(invoiceItems);
  const [drugData, setDruData] = useState<InvoiceDrugEditorModel[]>(drugItems);
  const [additPaymentData, setAdditPaymentData] = useState<AdditPaymentModelEditorModel[]>(additPaymentItems || []);
  const [isModalDrugOpen, setModalDrugOpen] = useState(false);
  const [isAdditPaymentOpen, setModalAdditPaymentOpen] = useState(false);
  const [adpInChargeItems, setAdpInCharge] = useState<AdditPaymentModelEditorModel[]>([]);
  const [adpShowFeeDrug, setModalAdpShowFeeDrug] = useState(false);
  const [chargeAdjust, setChargeAdjust] = useState<ChargeModel>(defaultCharge);


  useEffect(() => {
    // formBillingEditor.resetFields(["InvoiceAdp"]);
    recalcAdpCharges({
      visitDetail: visitDetail,
      patientData: patientData,
      invoiceEditors: invoiceData,
      adtEditors: additPaymentData,
      reconcile: true,
      chargeCalcScope: chargeAdjust.prefix,
    }).then((invoiceUtdAdp) => {
      setInvoiceData(invoiceUtdAdp);
      setChargeAdjust(defaultCharge);
    });
  }, [additPaymentData]);

  useEffect(() => {
    recalcDrugCharges({
      seqKey: visitDetail?.seq || visitDetail?.an || "",
      invoiceEditors: invoiceData,
      drugEditors: drugData,
    }).then((invoiceUtdDrug) => {
      setInvoiceData(invoiceUtdDrug);
      setChargeAdjust(defaultCharge);
    });
  }, [drugData]);

  useEffect(() => {
    triggerChange();
  }, [invoiceData]);

  const triggerChange = () => {
    onChange?.({
      invoiceItems: invoiceData,
      drugItems: drugData,
      adpItems: additPaymentData,
    });
  };

  //#region Editor
  function takeAction(chargeCode: InvoiceItemModel) {
    const { chrgitem } = chargeCode;
    setChargeAdjust({
      prefix: chrgitem,
      name: getChargeText(chrgitem),
      chargeTypes: getChargeTypes(chrgitem),
    });

    if (chrgitem.startsWith(drugInChargePrefix) || chrgitem.startsWith(drugExChargePrefix)) {
      setModalDrugOpen(true);
      return;
    }

    const charge = allChargeItems.find(t => chrgitem.startsWith(t.prefix));
    const adpInCharges = [...additPaymentData.filter(t => charge?.chargeTypes.includes(t.type))];
    setAdpInCharge(adpInCharges);
    setModalAdpShowFeeDrug(chrgitem.startsWith(additionalPaymentChargePrefix));
    setModalAdditPaymentOpen(true);
  }

  async function saveInvoiceDrug(): Promise<void> {
    const drugEditing = formBillingEditor.getFieldValue("InvoiceDrug");
    // console.log("drugEditing.drugItems=>", drugEditing.drugItems);
    setDruData(drugEditing.drugItems);
    // if (drugEditing.moveInvoiceItems.length > 0) {
    //   let moveInvoiceItems = drugEditing.moveInvoiceItems as MoveInvoiceItemModel[];
    //   let newPaymentData = await MoveDrugTo(moveInvoiceItems.filter(t => t.sourceFileID === drugFileCode));
    //   setAdditPaymentData(newPaymentData);
    // } else {
    //   setAdditPaymentData(additPaymentItems || []);
    // }
    setAdditPaymentData(additPaymentItems || []);
    setModalDrugOpen(false);
  }
  const MoveDrugTo = async (drugMoveItems: MoveInvoiceItemModel[]) => {
    let newPaymentData = [...additPaymentData];
    let drugMoveToAdpItems = drugMoveItems.filter(t => t.chargeCodeTo.startsWith(additionalPaymentChargePrefix));
    await drugMoveToAdpItems.forEach(t => {
      let drugIndex = drugItems.findIndex(d => d.id === t.id);
      if (drugIndex < 0) return;

      let drug = drugItems[drugIndex];
      let feeDrug = { id: drug.id, code: '', name: drug.didname, unitPrice: drug.drugprice.toString() };
      const typeText = getAdpDisplay(adpTypeNonGroup)
      console.log('visitDetail=>', visitDetail);
      let newItem: AdditPaymentModelEditorModel = {
        dummyKey: drug.id.split('-')[0],
        isDurty: false,
        hasError: drug.hasError,
        id: drug.id,
        seq: visitDetail?.seq || "",
        an: visitDetail?.an || "",
        hn: drug.hn,
        dateopd: drug.date_serv,
        type: adpTypeNonGroup,
        typeDisplay: typeText,
        typeEditor: { id: adpTypeNonGroup, text: typeText },
        code: drug.did,
        feeDrug: { ...feeDrug },
        feeEditor: { ...feeDrug },
        isFeeDrug: true,
        qty: drug.amount,
        rate: drug.drugprice,
        dose: drug.unit,
        total: drug.total,
        totcopay: drug.totcopay,
        clinic: visitDetail?.clinic || "",
        itemsrc: 2,
      };
      let adpIndex = newPaymentData.findIndex(a => a.id === t.id);
      if (adpIndex < 0) {
        newPaymentData.push(newItem);
      } else {
        let adpItem = newPaymentData[adpIndex];
        newPaymentData.splice(adpIndex, 1, {
          ...adpItem,
          ...newItem,
          dummyKey: adpItem.dummyKey,
        });
      }
    });
    return newPaymentData;
  }

  async function saveInvoiceAdditPayment(): Promise<void> {
    const adpEditing = formBillingEditor.getFieldValue("InvoiceAdp");
    // console.log("adpEditing.adpItems=>", adpEditing.adpItems);
    if (adpEditing?.adpItems != undefined) {
      let tempAdpData = [...additPaymentData];
      const orginalAdpInCharges = [...additPaymentData.filter(t => chargeAdjust.chargeTypes.includes(t.type))];
      const orginalAdpOutCharges = [...additPaymentData.filter(t => !chargeAdjust.chargeTypes.includes(t.type))];
      if (adpEditing.adpItems.length > 0 || false) {
        const adpEditingItems = adpEditing.adpItems as AdditPaymentModelEditorModel[];
        //#region Add or Update to Original Items
        await adpEditingItems.forEach((adpEditItem) => {
          const index = orginalAdpInCharges.findIndex((item) => adpEditItem.id == item.id);
          if (index > -1) {
            // let orginalAdpInCharge = orginalAdpInCharges[index];
            const updateIndex = tempAdpData.findIndex((temp) => adpEditItem.id == temp.id);
            if (updateIndex > -1) {
              tempAdpData.splice(updateIndex, 1, {
                ...adpEditItem
              });
              return;
            }
          }

          tempAdpData.push(adpEditItem);
        });
        //#endregion
        //#region Delete From Original Items
        await orginalAdpInCharges.forEach((orginalAdp) => {
          const findIndex = adpEditingItems.findIndex((item) => orginalAdp.id == item.id);
          if (findIndex > -1) return;

          const delIndex = tempAdpData.findIndex((temp) => orginalAdp.id == temp.id);
          if (delIndex <= -1) return;
          tempAdpData.splice(delIndex, 1);
        });
        //#endregion
        setAdditPaymentData(tempAdpData);
      } else {
        setAdditPaymentData([...orginalAdpOutCharges]);
      }
    }
    setAdpInCharge([]);
    setModalAdditPaymentOpen(false);
  }
  //#endregion

  //#region Local Filter Data
  const columns: TableColumnsType<InvoiceItemEditorModel> = [
    {
      title: <p className="Center">หมวด</p>,
      dataIndex: "dummyKey",
      key: "dummyKey",
      width: 15,
      fixed: "left",
      ellipsis: true,
      className: "Center",
    },
    {
      title: "รายการค่าบริการทางการแพทย์",
      dataIndex: "chargeDetail",
      key: "chargeDetail",
      width: 80,
      ellipsis: true,
    },
    {
      title: "ขอเบิก",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 40,
      ellipsis: true,
      render: (totalAmount) => (
        // <Text type={totalAmount == 0 ? 'secondary' : 'warning'}>{totalAmount}</Text>
        <Statistic
          precision={2}
          value={totalAmount}
          valueStyle={{
            fontSize: "16px",
            color: totalAmount == 0 ? "gray" : "black",
          }}
        />
      ),
    },
    {
      title: "เบิกไม่ได้",
      dataIndex: "overAmount",
      key: "overAmount",
      width: 40,
      ellipsis: true,
      render: (overAmount) => (
        <Statistic
          precision={2}
          value={overAmount}
          valueStyle={{
            fontSize: "16px",
            color: overAmount == 0 ? "gray" : "orange",
          }}
        />
      ),
    },
    {
      title: <p className="Center">สถานะ</p>,
      dataIndex: "status",
      key: "status",
      width: 30,
      fixed: "right",
      ellipsis: true,
      className: "Center",
      render: (status) => (
        <Text italic type={getStatusDisplayType(status)}>
          {getClaimStatusText(status)}
        </Text>
      ),
    },
    {
      title: <p className="Center">จัดการ</p>,
      key: "action",
      width: 20,
      fixed: "right",
      ellipsis: true,
      className: "Center",
      render: (_: any, record: InvoiceItemEditorModel) =>
        // record.status == 0 ? (
        //   <></>
        // ) : (
        <Button
          type="primary"
          ghost
          block
          style={{ border: 0 }}
          icon={<FileDoneOutlined />}
          onClick={() => takeAction(record)}
        />,
      // ),
    },
    {
      title: <p className="Center">ตรวจสอบ</p>,
      key: "action",
      width: 20,
      fixed: "right",
      ellipsis: true,
      className: "Center",
      render: (_: any, record: InvoiceItemEditorModel) =>
        record.valid?.length === 0 ? (
          <Tag color="#87d068">ผ่าน</Tag>
        ) : (
          <Button
            type="primary"
            ghost
            block
            style={{ border: 0 }}
            icon={
              <Badge count={record.valid?.length} color="#f5222d">
                <Tag color="#f5222d">ไม่ผ่าน</Tag>
              </Badge>
            }
            onClick={() => takeAction(record)}
          />
        ),
    },
  ];
  //#endregion
  const calculetMoney = () => {
    const adpEditing = formBillingEditor.getFieldValue("InvoiceAdp");

    console.log(adpEditing);

  }
  return (
    <>
      <Button onClick={calculetMoney}>คำนวนราคา</Button>
      <br />
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={invoiceData}
        size="small"
        className={"MasterBackground"}
        pagination={false}
        style={{ margin: -10, width: "99%" }}
        sticky
        scroll={{ x: 500 }}
      />
      <Form form={formBillingEditor} layout="inline"
        initialValues={{
          InvoiceDrug: { drugItems: drugItems },
          InvoiceAdp: { additionalItems: adpInChargeItems },
        }}
      >
        <Modal
          title={<Space>
            <FileExclamationTwoTone twoToneColor="#ffab00" />
            {`${chargeAdjust.name} (จำนวน ${drugItems.length || 0} รายการ)`}
          </Space>}
          open={isModalDrugOpen} centered width={"90%"}

          onCancel={() => setModalDrugOpen(false)} cancelText={"ปิด"}
          onOk={saveInvoiceDrug} okText="นำไปใช้"
        >
          <Form.Item name="InvoiceDrug">
            <InvoiceDrugPage drugItems={drugItems} />
          </Form.Item>
        </Modal>
        <Modal
          title={<Space>
            <FileExclamationTwoTone twoToneColor="#ffab00" />
            {`${chargeAdjust.name} (จำนวน ${adpInChargeItems.length || 0} รายการ)`}
          </Space>}
          open={isAdditPaymentOpen} centered width={"90%"}
          onCancel={() => setModalAdditPaymentOpen(false)} cancelText={"ปิด"}
          onOk={saveInvoiceAdditPayment}
          okText="นำไปใช้"
        >
          <Form.Item name="InvoiceAdp">
            <InvoiceAdditionalPage visitDetail={visitDetail} additionalItems={adpInChargeItems}
              showFeeDrug={adpShowFeeDrug} adpTypes={chargeAdjust.chargeTypes} />
          </Form.Item>
        </Modal>
      </Form>
    </>
  );
};

export default InvoiceBillingTab
