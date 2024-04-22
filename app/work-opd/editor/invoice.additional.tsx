
"use client";

//#region Import
import React, { useState, useEffect } from "react";
import {
    Button, Typography, Table,
    Form, Space, Popconfirm,
    Tooltip, Tag,
} from "antd";
import type { TableProps, TableColumnProps } from "antd";
import {
    EditTwoTone,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { AdditPaymentModelEditorModel } from "@/store/free-additional/additionalModel";
import { EditableCell } from "@/client.component/antd.table.editable";
import { FreeDrugSelector } from "@/app/catalogs/selector.free.drug";
import { isNumber } from "@/client.constant/format.constant";
import { FreeDrugSelectorModel } from "@/store/free-additional/freeDrugModel";
//#endregion

type InvoiceAdditionalProps = {
    additionalItems?: AdditPaymentModelEditorModel[],
    onChange?: any,
};

const { Text } = Typography;

const InvoiceAdditionalPage = function InvoiceAdditional({ additionalItems = [], onChange }: InvoiceAdditionalProps) {

    const [formAdpEditor] = Form.useForm();
    const [editingAdditionalData, setEditingData] = useState<AdditPaymentModelEditorModel[]>([]);
    const [editingKey, setEditingKey] = useState("");

    useEffect(() => {
        console.log('invoice.additional', additionalItems);
        setEditingData(additionalItems);
    }, [additionalItems]);

    const triggerChange = (additionalData: AdditPaymentModelEditorModel[]) => {
        onChange?.({ adpItems: additionalData });
    };

    //#region Editor
    const cancel = () => {
        setEditingKey("");
    };

    // const addItem = () => {
    //     const newData = [...editingAdditionalData];
    //     let newId = uuid();
    //     newData.push({
    //         id: newId,
    //         ...xxx
    //     });
    //     setEditingKey(newId);
    //     setEditingData(newData);
    // };

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
            const newData = [...editingAdditionalData];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                if (row.freeDrug.code.length > 0) row.code = row.freeDrug.code || row.code;
                if (isNumber(Number(row.freeDrug.unitPrice))) {
                    let unitPrice = Number(row.freeDrug.unitPrice);
                    row.rate = unitPrice
                    row.totalreq = row.totalreq > 0 ? row.totalreq : unitPrice * Number(item.qty.toString());
                }
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

            triggerChange(newData);
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
            title: "ประเภท",
            dataIndex: "typeDisplay",
            key: "typeDisplay",
            width: 20,
            ellipsis: true,
        },
        {
            title: "รหัสรายการ",
            dataIndex: "freeDrug",
            key: "freeDrug",
            width: 30,
            editable: true,
            selectorNode: <FreeDrugSelector showCode />,
            render: (_: any, freeDrug: FreeDrugSelectorModel) => { return <>{freeDrug.name || freeDrug.code}</> },
        },
        {
            title: "หน่วย",
            key: "unit",
            width: 20,
            render: (_: any, record: AdditPaymentModelEditorModel) => {
                return <>{`${record.qty} ${record.dose}`}</>
            }
        },
        {
            title: "ราคา",
            dataIndex: "rate",
            key: "rate",
            width: 20,
            ellipsis: true,
        },
        {
            title: "พึ่งเบิกได้",
            dataIndex: "total",
            key: "total",
            width: 15,
            ellipsis: true,
        },
        {
            title: "ขอเบิก",
            dataIndex: "totalreq",
            key: "totalreq",
            width: 15,
            ellipsis: true,
            editable: true,
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
        let numTypes = ["totcopay", "totalreq"];
        let selectorTypes = ["freeDrug"];
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
                selectorNode: (col.selectorNode || <></>),
                styleClass: record.hasError ? 'Col-Table-Row-Error' : '',
            }),
        } as TableColumnProps<AdditPaymentModelEditorModel>;
    });
    //#endregion

    return (
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
    );
};

export default InvoiceAdditionalPage;
