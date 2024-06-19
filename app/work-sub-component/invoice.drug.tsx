"use client";

//#region Import
import React, { useState, useEffect } from "react";
import { Button, Typography, Table, Form, Space, Popconfirm, Tooltip, Tag, } from "antd";
import type { TableProps, TableColumnProps } from "antd";
import { EditTwoTone, CheckOutlined, CloseOutlined, DeleteOutlined, UndoOutlined, WarningTwoTone, } from "@ant-design/icons";
import { InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import { MoveInvoiceItemModel } from "@/store/financial/moveItemModel";
import { EditableCell } from "@/client.component/antd.table.editable";
import { drugFileCode, drugExChargePrefix, additionalPaymentChargePrefix } from "@/client.constant/invoice.billing.constant";
import "@/app/globals.css";
//#endregion

type InvoiceDrugProps = {
  drugItems?: InvoiceDrugEditorModel[],
  moveInvoiceItems?: MoveInvoiceItemModel[],
  onChange?: any,
};

const { Text } = Typography;

const InvoiceDrugPage = function InvoiceDrug({ drugItems = [], onChange }: InvoiceDrugProps) {

  const [formDrugEditor] = Form.useForm();
  const [editingDrugData, setEditingData] = useState<InvoiceDrugEditorModel[]>(drugItems);
  const [editingKey, setEditingKey] = useState("");
  const [moveItems, setMoveItems] = useState<MoveInvoiceItemModel[]>([]);

  useEffect(() => {
    // console.log('invoice.drug', drugItems);
    setEditingData(drugItems);
  }, [drugItems]);

  function refreshItems(): void {
    setEditingData(drugItems);
    setMoveItems([]);
    triggerChange(drugItems, []);
  };

  const triggerChange = (drugData: InvoiceDrugEditorModel[], moveData: MoveInvoiceItemModel[]) => {
    onChange?.({
      drugItems: drugData,
      moveInvoiceItems: moveData,
    });
  };

  //#region Editor
  const cancel = () => {
    setEditingKey("");
  };

  // const addItem = () => {
  //     const newData = [...editingDrugData];
  //     let newId = uuid();
  //     newData.push({
  //         id: newId,
  //         ...xxx
  //     });
  //     setEditingKey(newId);
  //     setEditingData(newData);
  // };

  const viewMode = editingKey === "";
  const isEditing = (record: InvoiceDrugEditorModel) => record.id === editingKey;
  function editItem(record: Partial<InvoiceDrugEditorModel>): void {
    formDrugEditor.setFieldsValue({ ...record });
    setEditingKey(record?.id || "");
  };

  function moveItemToCharge(record: InvoiceDrugEditorModel): void {
    try {
      let chargeCodeTo: string = additionalPaymentChargePrefix + '1';
      let item: MoveInvoiceItemModel = {
        id: record.id,
        sourceFileID: drugFileCode,
        chargeCodeFrom: drugExChargePrefix,
        chargeCodeTo: chargeCodeTo,
        name: `${record.did}: ${record.didname}`
      }
      let newMoveItems = [...moveItems, item];
      setMoveItems(newMoveItems);
      let newData = deleteItem(record.id);
      triggerChange(newData, newMoveItems);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  }

  function deleteItem(key: React.Key): InvoiceDrugEditorModel[] {
    const newData = [...editingDrugData];
    const index = newData.findIndex((item) => key === item.id);
    if (index > -1) {
      newData.splice(index, 1);
      setEditingData(newData);
    }
    return newData;
  };

  async function saveItem(key: React.Key): Promise<void> {
    try {
      const row = (await formDrugEditor.validateFields()) as InvoiceDrugEditorModel;
      const newData = [...editingDrugData];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setEditingData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingData(newData);
        setEditingKey("");
      }

      triggerChange(newData, moveItems);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  //#endregion

  //#region Local Filter Data
  const columns = [
    {
      title: <p className="Center">ลำดับ</p>,
      dataIndex: "dummyKey",
      key: "dummyKey",
      width: 15,
      className: "Center",
    },
    {
      title: "รหัสยา",
      dataIndex: "did",
      key: "did",
      width: 20,

    },
    {
      title: "ชื่อยา",
      dataIndex: "didname",
      key: "didname",
      width: 50,
      ellipsis: true,
    },
    {
      title: "หน่วย",
      key: "unit",
      width: 20,
      render: (_: any, record: InvoiceDrugEditorModel) => {
        return <>{`${record.amount} ${record.unit}`}</>
      }
    },
    {
      title: "ราคาขาย",
      dataIndex: "drugprice",
      key: "drugprice",
      width: 20,

    },
    {
      title: "พึ่งเบิกได้",
      dataIndex: "total",
      key: "total",
      width: 30,
      ellipsis: true,
      editable: true,
    },
    {
      title: "ส่วนเกิน",
      dataIndex: "totcopay",
      key: "totcopay",
      width: 30,
      ellipsis: true,
      editable: true,
    },
    {
      title: <p className="Center">{"ไม่ผ่าน"}</p>,
      dataIndex: "validError",
      key: "validError",
      className: "Center",
      width: 20,
      ellipsis: true,
      render: (_: any, record: InvoiceDrugEditorModel) => {
        return record.validError?.map((i) => {
          return (
            <Tooltip title={`${i.code_error}: ${i.code_error_descriptions}`} >
              <WarningTwoTone twoToneColor="#ffab00" style={{ fontSize: '20px' }} />
            </Tooltip>
          );
        });
      },
    },
    {
      title: viewMode ? (
        <p className="Center"> <Space size="small">
          {"จัดการ"}
          <Tooltip title="ย้อนกลับ">
            <Button
              disabled={!viewMode}
              onClick={refreshItems}
              type="text" shape="circle"
              size="small" block
              icon={<UndoOutlined />}
            />
          </Tooltip></Space></p>
      ) : (
        <p className="Center">
          <Text type="warning">ยืนยัน ?</Text>
        </p>
      ),
      dataIndex: "operation",
      // className: "Center",
      fixed: 'right',
      width: 30,
      render: (_: any, record: InvoiceDrugEditorModel) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size="middle">
            <Button
              disabled={viewMode}
              onClick={() => saveItem(record.id)}
              type="text" size="small" block
              icon={<CheckOutlined style={{ color: 'green' }} />}
            />
            <Popconfirm okText="ใช่" cancelText="ไม่"
              title="แน่ใจการ[ยกเลิก] ?"
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
              {/* <Popconfirm okText="ใช่" cancelText="ไม่"
                title="แน่ใจการ[ลบ] ?"
                placement="bottom"
                onConfirm={() => moveItemToCharge(record)}
              > */}
              <Button
                onClick={() => moveItemToCharge(record)}
                disabled={!viewMode}
                type="text" size="small" block
                danger
                icon={<DeleteOutlined />}
              />
              {/* </Popconfirm> */}
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
        onCell: (record: InvoiceDrugEditorModel) => ({ className: record.hasError ? 'Col-Table-Row-Error' : '', })
      } as TableColumnProps<InvoiceDrugEditorModel>;
    }
    let numTypes = ["totcopay"];
    return {
      ...col,
      onCell: (record: InvoiceDrugEditorModel) => ({
        record,
        inputType: numTypes.includes(col.dataIndex) ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        styleClass: record.hasError ? 'Col-Table-Row-Error' : '',
      }),
    } as TableColumnProps<InvoiceDrugEditorModel>;
  });
  //#endregion

  return (
    <Space size={"small"} direction="vertical">
      <Form form={formDrugEditor} component={false}>
        <Table
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell<InvoiceDrugEditorModel>,
            },
          }}
          columns={mergedColumns}
          dataSource={editingDrugData || []}
          size="small"
          className={"MasterBackground"}
          pagination={{ pageSize: 10, simple: true }}
          style={{ margin: "10px 0", height: "500px", width: "99%" }}

        />
      </Form>
      <Space size={"small"} wrap>
        {
          moveItems.map((t) => { return <Tag color="warning">{t.name}</Tag> })
        }
      </Space>
    </Space>
  );
};

export default InvoiceDrugPage;
