"use client";

//#region Import
import React, { useState, useEffect } from "react";
// import { uuid } from 'uuidv4';
import {
  Button, Typography, Table,
  Form, Space, Popconfirm,
  Tooltip, Tag,
} from "antd";
import type { TableProps, TableColumnProps } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  SisternodeOutlined,
  UndoOutlined,
  FileExclamationTwoTone,
} from "@ant-design/icons";
import { DrugEditorModel } from "@/store/patient/drugModel";
import { MoveInvoiceItemModel } from "@/store/financial/moveItemModel";
import { EditableCell } from "@/client.component/antd.table.editable";
import {
  getStatusDisplayType,
  getClaimStatusText,
} from "@/client.constant/invoice.billing.constant";
import "@/app/globals.css";
//#endregion

type InvoiceDrugProps = {
  drugItems: DrugEditorModel[],
  moveInvoiceItems?: MoveInvoiceItemModel[],
  onChange?: any;
};
const { Text } = Typography;

const InvoiceDrugPage = function InvoiceDrug({ drugItems = [], onChange }: InvoiceDrugProps) {

  const [formEditor] = Form.useForm();
  const [editingData, setEditingData] = useState<DrugEditorModel[]>([]);
  const [editingKey, setEditingKey] = useState("");
  const [moveItems, setMoveItems] = useState<MoveInvoiceItemModel[]>([]);

  useEffect(() => {
    refreshItems()
  }, [drugItems]);

  useEffect(() => {
    triggerChange();
  }, [editingData, moveItems]);

  function refreshItems(): void {
    setEditingData(drugItems);
    setMoveItems([]);
  };

  const triggerChange = () => {
    onChange?.({
      drugItems: editingData,
      moveInvoiceItems: moveItems,
    });
  };

  //#region Editor


  const cancel = () => {
    setEditingKey("");
  };

  // const addItem = () => {
  //     const newData = [...editingData];
  //     let newId = uuid();
  //     newData.push({
  //         id: newId,
  //         ...xxx
  //     });
  //     setEditingKey(newId);
  //     setEditingData(newData);
  // };

  const viewMode = editingKey === "";
  const isEditing = (record: DrugEditorModel) => record.id === editingKey;
  function editItem(record: Partial<DrugEditorModel>): void {
    formEditor.setFieldsValue({ ...record });
    setEditingKey(record?.id || "");
  };

  function moveItemToCharge(record: DrugEditorModel): void {
    try {
      let chargeCode: string = 'J1';
      let item: MoveInvoiceItemModel = {
        id: record.id,
        chargeCode: chargeCode,
        name: `${record.did}: ${record.didname}`
      }
      setMoveItems([...moveItems, item]);
      deleteItem(record.id);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  }

  function deleteItem(key: React.Key): void {
    const newData = [...editingData];
    const index = newData.findIndex((item) => key === item.id);
    if (index > -1) {
      newData.splice(index, 1);
      setEditingData(newData);
    }
  };

  async function saveItem(key: React.Key): Promise<void> {
    try {
      const row = (await formEditor.validateFields()) as DrugEditorModel;
      const newData = [...editingData];
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
      ellipsis: true,
      className: "Center",
    },
    {
      title: "รหัสยา",
      dataIndex: "did",
      key: "did",
      width: 20,
      ellipsis: true,
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
      render: (_: any, record: DrugEditorModel) => {
        return <>{`${record.amount} ${record.unit}`}</>
      }
    },
    {
      title: "ราคาขาย",
      dataIndex: "drugprice",
      key: "drugprice",
      width: 20,
      ellipsis: true,
    },
    {
      title: "พึ่งเบิกได้",
      dataIndex: "total",
      key: "total",
      width: 30,
      ellipsis: true,
    },
    {
      title: "ขอเบิก",
      dataIndex: "totalreq",
      key: "totalreq",
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
      title: "ไม่ผ่าน",
      dataIndex: "validError",
      key: "validError",
      className: "Center",
      width: 20,
      ellipsis: true,
      render: (_: any, record: DrugEditorModel) => {
        return record.validError?.map((i) => {
          return (
            <Tooltip title={`${i.code_error}: ${i.code_error_descriptions}`} >
              <FileExclamationTwoTone twoToneColor="#ffab00" style={{ fontSize: '20px' }} />
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
      className: "Center",
      fixed: "right",
      width: 30,
      render: (_: any, record: DrugEditorModel) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size="small">
            <Button
              disabled={viewMode}
              onClick={() => saveItem(record.id)}
              type="primary"
              block
              shape="circle"
              size="small"
              icon={<CheckOutlined />}
            />
            <Popconfirm
              title="Sure to cancel?"
              placement="bottom"
              onConfirm={cancel}
            >
              <Button
                disabled={viewMode}
                type="primary"
                danger
                shape="circle"
                size="small"
                ghost
                block
                icon={<CloseOutlined />}
              />
            </Popconfirm>
          </Space>
        ) : (
          <Space size="small">
            {/* <Tooltip title="ย้ายไปยัง">
              <Button
                disabled={!viewMode}
                onClick={() => moveItemToCharge(record)}
                type="primary"
                shape="circle"
                size="small"
                block
                icon={<SisternodeOutlined />}
              />
            </Tooltip> */}
            <Tooltip title="แก้ไข">
              <Button
                disabled={!viewMode}
                onClick={() => editItem(record)}
                type="primary"
                shape="circle"
                size="small"
                ghost
                block
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="ลบออก">
              <Popconfirm
                title="Sure to delete?"
                placement="bottom"
                onConfirm={() => moveItemToCharge(record)}
              >
                <Button
                  disabled={!viewMode}
                  type="primary"
                  danger
                  shape="circle"
                  size="small"
                  ghost
                  block
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
        onCell: (record: DrugEditorModel) => ({ className: record.hasError ? 'Col-Table-Row-Error' : '', })
      } as TableColumnProps<DrugEditorModel>;
    }
    let numTypes = ["totcopay", "totalreq"];
    return {
      ...col,
      onCell: (record: DrugEditorModel) => ({
        record,
        inputType: numTypes.includes(col.dataIndex) ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        styleClass: record.hasError ? 'Col-Table-Row-Error' : '',
      }),
    } as TableColumnProps<DrugEditorModel>;
  });
  //#endregion

  return (
    <Space size={"small"} direction="vertical">
      <Form form={formEditor} component={false}>
        <Table
          rowKey={(record) => record.id}
          components={{
            body: {
              cell: EditableCell<DrugEditorModel>,
            },
          }}
          columns={mergedColumns}
          dataSource={editingData}
          size="small"
          className={"MasterBackground"}
          pagination={{ pageSize: 10, simple: true }}
          style={{ margin: "10px 0", height: "500px", width: "100%" }}
          sticky
          scroll={{ x: 400 }}
        />
      </Form>
      <Space size={"small"}>
        {
          moveItems.map((t) => { return <Tag color="warning">{t.name}</Tag> })
        }
      </Space>
    </Space>
  );
};

export default InvoiceDrugPage;
