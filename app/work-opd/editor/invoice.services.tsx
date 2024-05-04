"use client";
import { allServicePayment } from "@/client.constant/invoice.map.service";
import { AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import { Modal, Table } from "antd";
//#region Import
import React, { useEffect, useState } from "react";

//#region Import

//#region DataTyep
interface InvoiceServicesType {
  chargeItemNumber: string;
  chargeItemData: any[];
}

export interface InvoiceServicesProps {
  modelServiceOpen?: boolean;
  modelServoceDisplay?: string
  modelServiceData?: InvoiceServicesType
}
//#region DataTyep

//#region React FC
const InvoiceServices: React.FC<InvoiceServicesProps> = ({ modelServiceOpen, modelServiceData, modelServoceDisplay }) => {
  const [adpList, setAdpList] = useState<any[]>()
  const [modelOpen, setModelOpen] = useState<boolean | undefined>(false)
  useEffect(() => {
    setAdditional(modelServiceData?.chargeItemData)
    setModelOpen(modelServiceOpen)
    console.log(modelServiceData?.chargeItemNumber);

  }, [modelServiceData, modelServiceOpen])

  const onCloseModelSertvice = () => {
    setModelOpen(false)
  }

  const setAdditional = (itemValues: AdditPaymentModelEditorModel[] | undefined) => {
    if (modelServiceData === undefined) return

    const getAdpType = allServicePayment.find(i => i.paymentFileCode === (modelServiceData.chargeItemNumber.substring(0, 1)))
    const getItemAdp = itemValues?.filter(item => item.type === getAdpType?.chargeItemType)
    console.log(getItemAdp);
    setAdpList(getItemAdp)
  }
  //#columns
  const columns = [
    {
      title: <p className="Center">ลำดับ</p>,
      dataIndex: "dummyKey",
      key: "dummyKey",
      width: 15,
      ellipsis: true,
      className: "Center",
    },
    {
      title: "ประเภท",
      dataIndex: "typeEditor",
      key: "typeEditor",
      width: 30,
      ellipsis: true,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <>{record.typeDisplay}</>
      },
    },
    {
      title: "รหัสรายการ",
      dataIndex: "feeEditor",
      key: "feeEditor",
      width: 40,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <>{record.isFeeDrug
          ? record.feeDrug?.name || record.feeDrug?.code
          : record.feeSchedule?.item_name || record.feeSchedule?.item_code
        }
        </>
      },
    },
    {
      title: "หน่วย",
      dataIndex: "qty",
      key: "unit",
      width: 20,
      editable: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return <>{`${record.qty} [${record.dose}]`}</>
      }
    },
    {
      title: "ราคา",
      dataIndex: "rate",
      key: "rate",
      width: 20,
      ellipsis: true,
      editable: true,
    },
    {
      title: "พึ่งเบิกได้",
      dataIndex: "total",
      key: "total",
      width: 15,
      ellipsis: true,
    },
    {
      title: "ส่วนเกิน",
      dataIndex: "totcopay",
      key: "totcopay",
      width: 15,
      ellipsis: true,
      editable: true,
    }]

  //#render
  return (
    <React.Fragment>
      <Modal open={modelOpen}
        title={modelServoceDisplay}
        width={'100%'}
        onCancel={onCloseModelSertvice}>
        <Table columns={columns} dataSource={adpList} />
      </Modal>

    </React.Fragment>
  )
}
//#region React FC
export default InvoiceServices