
"use client";

//#region Import
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Typography, Table, Form, Space, Popconfirm, Tooltip, Tag, Row, Col, } from "antd";
import type { TableProps, TableColumnProps } from "antd";
import { EditTwoTone, CheckOutlined, CloseOutlined, DeleteOutlined, FileAddOutlined, } from "@ant-design/icons";
import { AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import { EditableCell } from "@/client.component/antd.table.editable";
import { FeeDrugSelector } from "@/app/catalogs/selector.fee.drug";
import { FeeScheduleSelector } from "@/app/catalogs/selector.fee.schedule";
import { isNumber } from "@/client.constant/format.constant";
import { FeeDrugSelectorModel } from "@/store/fee-additional/feeDrugModel";
import { FeeScheduleSelectorModel } from "@/store/fee-additional/feeScheduleModel";
import { OpdDetailModel } from "@/store/work-opd/opdEditorModel";
import { adpTypeNonGroup, adpTypeFreeSchedule } from "@/client.constant/invoice.additional.constant";
import { getAdpDisplay } from "@/client.constant/invoice.addit.payment.constant";
//#endregion

type InvoiceAdditionalProps = {
  opdData?: OpdDetailModel,
  additionalItems?: AdditPaymentModelEditorModel[],
  onChange?: any,
};

const { Text } = Typography;

const InvoiceAdditionalPage = function InvoiceAdditional({ opdData, additionalItems = [], onChange }: InvoiceAdditionalProps) {

  const [formAdpEditor] = Form.useForm();
  const [editingAdditionalData, setEditingData] = useState<AdditPaymentModelEditorModel[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const defaultFeeDrug = { id: "", code: "", unitPrice: "" };
  const [feeDrugSelected, setDrugSelected] = useState<FeeDrugSelectorModel>(defaultFeeDrug);
  const defaultFeeSchedule = { item_code: "", item_name: "" };
  const [feeScheduleSelected, setScheduleSelected] = useState<FeeScheduleSelectorModel>(defaultFeeSchedule);

  useEffect(() => {
    // console.log('invoice.additional', additionalItems);
    setEditingData(additionalItems);
  }, [additionalItems]);

  const triggerChange = (additionalData: AdditPaymentModelEditorModel[]) => {
    onChange?.({ adpItems: additionalData });
  };

  //#region Editor
  const cancel = () => {
    setEditingKey("");
  };

  const addItemFeeDrug = () => {
    const additionalData = [...editingAdditionalData];
    let newId = uuidv4();
    if (feeDrugSelected.code != "" && feeDrugSelected.code != undefined) {
      let unitPrice = isNumber(Number(feeDrugSelected.unitPrice)) ? Number(feeDrugSelected.unitPrice) : 0;
      let qty = 1;
      const newData: AdditPaymentModelEditorModel = {
        dummyKey: (additionalData?.length || 0) + 1,
        isDurty: false,
        hasError: false,
        id: newId,
        seq: opdData?.seq || "",
        hn: opdData?.hn || "",
        dateopd: opdData?.dateopd || new Date,
        type: adpTypeNonGroup,
        typeDisplay: getAdpDisplay(adpTypeNonGroup),
        code: feeDrugSelected.code,
        feeDrug: { ...feeDrugSelected },
        feeEditor: { ...feeDrugSelected },
        isFeeDrug: true,
        qty: qty,
        rate: unitPrice,
        dose: feeDrugSelected.strength,
        total: Number(unitPrice) * Number(qty),
        totcopay: 0,
        clinic: opdData?.clinic || "",
        itemsrc: 2,
      }
      additionalData.push(newData);
      setEditingData(additionalData);
    }
  };

  const addItemFeeSchedule = () => {
    const additionalData = [...editingAdditionalData];
    let newId = uuidv4();
    if (feeScheduleSelected.item_code != "" && feeScheduleSelected.item_code != undefined) {
      let unitPrice = isNumber(Number(feeScheduleSelected.price)) ? Number(feeScheduleSelected.price) : 0;
      let qty = 1;
      const newData: AdditPaymentModelEditorModel = {
        dummyKey: (additionalData?.length || 0) + 1,
        isDurty: false,
        hasError: false,
        id: newId,
        seq: opdData?.seq || "",
        hn: opdData?.hn || "",
        dateopd: opdData?.dateopd || new Date,
        type: adpTypeFreeSchedule,
        typeDisplay: getAdpDisplay(adpTypeFreeSchedule),
        code: feeScheduleSelected.item_code,
        feeSchedule: { ...feeScheduleSelected },
        feeEditor: { ...feeScheduleSelected },
        isFeeDrug: false,
        qty: qty,
        rate: unitPrice,
        dose: feeScheduleSelected.unit,
        total: Number(unitPrice) * Number(qty),
        totcopay: 0,
        clinic: opdData?.clinic || "",
        itemsrc: 2,
      }
      additionalData.push(newData);
      setEditingData(additionalData);
    }
  };

  const viewMode = editingKey === "";
  const isEditing = (record: AdditPaymentModelEditorModel) => record.id === editingKey;
  function editItem(record: Partial<AdditPaymentModelEditorModel>): void {
    formAdpEditor.setFieldsValue({ ...record });
    setEditingKey(record?.id || "");
  };

  function deleteItem(key: React.Key): void {
    const newData = [...editingAdditionalData];
    const index = newData.findIndex((item) => key === item.id);
    if (index > -1) {
      newData.splice(index, 1);
      setEditingData(newData);
    }
  };

  async function saveItem(key: React.Key): Promise<void> {
    try {
      const row = (await formAdpEditor.validateFields()) as AdditPaymentModelEditorModel;
      console.log("row=>", row);
      const newData = [...editingAdditionalData];
      const index = newData.findIndex((item) => key === item.id);
      let hasCode: boolean = (row.code != '');
      if (index > -1) {
        const item = newData[index];
        if (item.isFeeDrug) {
          let rowFeeDrug = row.feeEditor as FeeDrugSelectorModel;
          row.feeDrug = { ...rowFeeDrug };
          if ((rowFeeDrug.code).length > 0) row.code = rowFeeDrug.code || row.code;
          if (isNumber(Number(rowFeeDrug.unitPrice))) {
            let unitPrice = Number(rowFeeDrug.unitPrice);
            let totalreq = unitPrice * Number(row.qty);
            row.rate = unitPrice
            row.total = totalreq;
          } else {
            row.total = Number(row.rate) * Number(row.qty);
          }
        } else {
          let rowFeeSchedule = row.feeEditor as FeeScheduleSelectorModel;
          row.feeSchedule = { ...rowFeeSchedule };
          if ((rowFeeSchedule.item_code).length > 0) row.code = rowFeeSchedule.item_code || row.code;
          if (isNumber(Number(rowFeeSchedule.price))) {
            let unitPrice = Number(rowFeeSchedule.price);
            let totalreq = unitPrice * Number(row.qty);
            row.rate = unitPrice
            row.total = totalreq;
          } else {
            row.total = Number(row.rate) * Number(row.qty);
          }
        }

        newData.splice(index, 1, {
          ...item,
          ...row,
          hasError: !hasCode
        });
        setEditingData(newData);
        setEditingKey("");
      } else {
        newData.push({ ...row, hasError: !hasCode });
        setEditingData(newData);
        setEditingKey("");
      }

      triggerChange(newData);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  function onManualFreeDrugChange(selected: FeeDrugSelectorModel) {
    setDrugSelected(selected);
  }
  function onManualFreeScheduleChange(selected: FeeScheduleSelectorModel) {
    setScheduleSelected(selected);
  }
  //#endregion

  //#region Local Filter Data
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
      dataIndex: "typeDisplay",
      key: "typeDisplay",
      width: 20,
      ellipsis: true,
    },
    {
      title: "รหัสรายการ",
      dataIndex: "feeEditor",
      key: "feeEditor",
      width: 30,
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
    },
    {
      title: viewMode
        ? (<p className="Center">{"จัดการ"}</p>)
        : (<p className="Center"><Text type="warning">ยืนยัน ?</Text></p>),
      dataIndex: "operation",
      className: "Center",
      fixed: "right",
      width: 20,
      render: (_: any, record: AdditPaymentModelEditorModel) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size="middle">
            <Button
              disabled={viewMode}
              onClick={() => saveItem(record.id)}
              type="text" size="small" block
              icon={<CheckOutlined style={{ color: 'green' }} />}
            />
            <Popconfirm
              title="Sure to cancel?"
              placement="bottom"
              onConfirm={cancel}
            >
              <Button
                disabled={viewMode}
                type="text" size="small" block danger
                icon={<CloseOutlined />}
              />
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            <Tooltip title="แก้ไข">
              <Button
                disabled={!viewMode}
                onClick={() => editItem(record)}
                type="text" size="small" block
                icon={<EditTwoTone />}
              />
            </Tooltip>
            <Tooltip title="ลบออก">
              <Popconfirm
                title="Sure to delete?"
                placement="bottom"
                onConfirm={() => deleteItem(record.id)}
              >
                <Button
                  disabled={!viewMode}
                  type="text" size="small" block
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const mergedColumns: TableProps["columns"] = columns.map((col) => {
    if (!col.editable) {
      return {
        ...col,
        onCell: (record: AdditPaymentModelEditorModel) => ({ className: record.hasError ? 'Col-Table-Row-Error' : '', })
      } as TableColumnProps<AdditPaymentModelEditorModel>;
    }
    let numTypes = ["totcopay"];
    let selectorTypes = ["feeEditor"];
    return {
      ...col,
      onCell: (record: AdditPaymentModelEditorModel) => ({
        record,
        inputType: numTypes.includes(col.dataIndex)
          ? "number"
          : selectorTypes.includes(col.dataIndex)
            ? "selector"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        selectorNode: record.isFeeDrug ? <FeeDrugSelector propKey="inlineAdd" showCode />
          : <FeeScheduleSelector propKey="inlineAdd" showCode />,
        styleClass: record.hasError ? 'Col-Table-Row-Error' : '',
      }),
    } as TableColumnProps<AdditPaymentModelEditorModel>;
  });
  //#endregion

  return (
    <Space direction="vertical" >
      <Row gutter={[8, 16]} style={{ width: '100%' }} justify={"space-between"} >
        <Col span={9}>
          <FeeDrugSelector propKey="manualDrugAdd" showCode showPrice
            onChange={onManualFreeDrugChange} value={feeDrugSelected}
          />
        </Col>
        <Col span={3}>
          <Button
            disabled={feeDrugSelected.code == "" || feeDrugSelected.code == undefined}
            onClick={addItemFeeDrug}
            type="primary" ghost
            icon={<FileAddOutlined />}>
            เพิ่ม
          </Button>
        </Col>
        <Col span={9}>
          <FeeScheduleSelector propKey="manualFeeAdd" showCode showPrice
            onChange={onManualFreeScheduleChange} value={feeScheduleSelected}
          />
        </Col>
        <Col span={3}>
          <Button
            disabled={feeScheduleSelected.item_code == "" || feeScheduleSelected.item_code == undefined}
            onClick={addItemFeeSchedule}
            type="primary" ghost
            icon={<FileAddOutlined />}>
            เพิ่ม
          </Button>
        </Col>
      </Row>
      <Form form={formAdpEditor} component={false}>
        <Table
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell<AdditPaymentModelEditorModel>,
            },
          }}
          columns={mergedColumns}
          dataSource={editingAdditionalData}
          size="small"
          className={"MasterBackground"}
          pagination={{ pageSize: 10, simple: true }}
          style={{ margin: "10px 0", height: "500px", width: "100%" }}
          sticky
          scroll={{ x: 400 }}
        />
      </Form>
    </Space>
  );
};

export default InvoiceAdditionalPage;
