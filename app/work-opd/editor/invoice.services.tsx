"use client";
import { allServicePayment } from "@/client.constant/invoice.map.service";
import { AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import { useAppSelector } from "@/store/hooks";
import { OpdValidModel, WorkValidModel } from "@/store/work-opd/opdEditorModel";
import { getValid } from "@/store/work-opd/workOpdSlice";
import { WarningTwoTone } from "@ant-design/icons";
import { Modal, Table, Tooltip } from "antd";
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
  modelServiceData?: InvoiceServicesType
}
//#region DataTyep

//#region React FC
const InvoiceServices: React.FC<InvoiceServicesProps> = ({ modelServiceOpen, modelServiceData }) => {
  const valid: OpdValidModel[] | undefined = useAppSelector(getValid);
  const [adpList, setAdpList] = useState<any[]>()
  const [modelOpen, setModelOpen] = useState<boolean | undefined>(false)
  const [modelServoceDisplay, setModelServoceDisplay] = useState<string | undefined>("")
  useEffect(() => {
    setAdditional(modelServiceData?.chargeItemData)
    setModelOpen(modelServiceOpen)
    //console.log(modelServiceData?.chargeItemNumber);

  }, [modelServiceData, modelServiceOpen])

  const onCloseModelSertvice = () => {
    setModelOpen(false)
  }

  const setAdditional = (itemValues: AdditPaymentModelEditorModel[] | undefined) => {
    if (modelServiceData === undefined) return
    const getItemAdp: any[] = []
    const getAdpType = allServicePayment.find(i => i.paymentFileCode === (modelServiceData.chargeItemNumber.substring(0, 1)))
    itemValues?.forEach(valuse => {
      const getListType = getAdpType?.chargeItemType.filter(i => i === valuse.type) as unknown as string[]
      if (getListType.length > 0) {
        getItemAdp.push(valuse)
      }
    })

    setModelServoceDisplay(getAdpType?.paymentName)
    setAdpList(mappingAdpError(getItemAdp))
  }

  const mappingAdpError = (itemAdp: any[]) => {
    const itemAdpError = valid?.filter((i) => i.adp)[0]["adp"] as unknown as WorkValidModel[];

    console.log(itemAdpError);

    return itemAdp.map(adp => {
      const getValidItem = itemAdpError.filter(valid => valid.id === adp.id)

      console.log(getValidItem);

      adp.validError.concat(getValidItem)

      let data = {
        ...adp,
        validError: getValidItem
      }
      return data
    })

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
    }, {
      title: "ไม่ผ่าน",
      dataIndex: "validError",
      key: "validError",
      className: "Center",
      width: 20,
      ellipsis: true,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        return record.validError?.map((i) => {
          return (
            <Tooltip title={`${i.code_error}: ${i.code_error_descriptions}`} >
              <WarningTwoTone twoToneColor="#ffab00" style={{ fontSize: '20px' }} />
            </Tooltip>
          );
        });
      },
    },]

  //#render
  return (
    <React.Fragment>
      <Modal open={modelOpen}
        title={modelServoceDisplay}
        width={'99%'}
        onCancel={onCloseModelSertvice}>
        <Table columns={columns} dataSource={adpList} />
      </Modal>

    </React.Fragment>
  )
}
//#region React FC
export default InvoiceServices