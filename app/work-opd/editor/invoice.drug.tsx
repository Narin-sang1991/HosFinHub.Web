"use client";

import React, { useState, useEffect } from 'react';
// import { uuid } from 'uuidv4';
import { Button, Typography, Table, Form, Space, Popconfirm, Tooltip, } from 'antd';
import type { TableProps, TableColumnProps } from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { DrugEditorModel } from '@/store/patient/drugModel';
import { EditableCell } from "@/client.component/antd.table.editable";
import { getStatusDisplayType, getClaimStatusText } from "@/client.constant/invoice.billing.constant";
import '@/app/globals.css';

type InvoiceDrugProps = { drugItems: DrugEditorModel[] }
const { Text } = Typography;

const InvoiceDrugPage = function InvoiceDrug({ drugItems }: InvoiceDrugProps) {

    const [formEditor] = Form.useForm();
    const [editingData, setEditingData] = useState<DrugEditorModel[]>([]);
    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        setEditingData(drugItems);
    }, [drugItems])


    //#region Editor    
    const cancel = () => {
        setEditingKey('');
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

    const viewMode = editingKey === '';
    const isEditing = (record: DrugEditorModel) => record.id === editingKey;
    const editItem = (record: Partial<DrugEditorModel>) => {
        formEditor.setFieldsValue({ ...record });
        setEditingKey(record?.id || '');
    };

    const deleteItem = (key: React.Key) => {
        const newData = [...editingData];
        const index = newData.findIndex((item) => key === item.id);
        if (index > -1) {
            newData.splice(index, 1);
            setEditingData(newData);
        }
    };

    const saveItem = async (key: React.Key) => {
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
                setEditingKey('');
            } else {
                newData.push(row);
                setEditingData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
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
            title: <p className="Center">สถานะ</p>,
            dataIndex: "status",
            key: "status",
            width: 20,
            ellipsis: true,
            className: "Center",
            render: (status: number) => (
                <Text italic type={getStatusDisplayType(status)} >
                    {getClaimStatusText(status)}
                </Text>
            )
        },
        {
            title: 'รหัสยา',
            dataIndex: "did",
            key: "did",
            width: 20,
            ellipsis: true,
        },
        {
            title: 'ชื่อยา',
            dataIndex: "didname",
            key: "didname",
            width: 50,
            ellipsis: true,
        },
        {
            title: 'หน่วย',
            dataIndex: "unit",
            key: "unit",
            width: 15,
            ellipsis: true,
        },
        {
            title: 'ราคาขาย',
            dataIndex: "drugprice",
            key: "drugprice",
            width: 30,
            ellipsis: true,
        },
        {
            title: 'จำนวน',
            dataIndex: "amount",
            key: "amount",
            width: 30,
            ellipsis: true,
        },
        {
            title: 'ขอเบิก',
            dataIndex: "total",
            key: "total",
            width: 30,
            ellipsis: true,
            editable: true,
        },
        {
            title: 'ส่วนเกิน',
            dataIndex: "totcopay",
            key: "totcopay",
            width: 30,
            ellipsis: true,
            editable: true,
        },
        {
            title: viewMode ? <p className="Center">Operation</p>
                : <p className="Center"><Text type='warning'>
                    Confirm ?
                </Text></p>,
            dataIndex: 'operation',
            className: "Center",
            fixed: 'right',
            width: 30,
            render: (_: any, record: DrugEditorModel) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space size="small">
                        <Button disabled={viewMode} onClick={() => saveItem(record.id)}
                            type="primary" block shape="circle" size='small' icon={<CheckOutlined />}
                        />
                        <Popconfirm title="Sure to cancel?" placement="bottom" onConfirm={cancel}>
                            <Button disabled={viewMode}
                                type="primary" danger shape="circle" size='small' ghost block icon={<CloseOutlined />}
                            />
                        </Popconfirm>
                    </Space>
                ) : (
                    <Space size="small">
                        <Tooltip title="Edit">
                            <Button disabled={!viewMode} onClick={() => editItem(record)}
                                type="primary" shape="circle" size='small' ghost block icon={<EditOutlined />}
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Popconfirm title="Sure to delete?" placement="bottom" onConfirm={() => deleteItem(record.id)}>
                                <Button disabled={!viewMode}
                                    type="primary" danger shape="circle" size='small' ghost block icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ]

    const mergedColumns: TableProps['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col as TableColumnProps<DrugEditorModel>;
        }
        let numTypes = ['totcopay', 'total']
        return {
            ...col,
            onCell: (record: DrugEditorModel) => ({
                record,
                inputType: numTypes.includes(col.dataIndex) ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        } as TableColumnProps<DrugEditorModel>;
    });
    //#endregion

    return (
        <Table
            rowKey={record => record.id}
            components={{
                body: {
                    cell: EditableCell<DrugEditorModel>,
                },
            }}
            // bordered
            columns={mergedColumns} dataSource={drugItems}
            size="small" className={"MasterBackground"}
            pagination={{ pageSize: 10, simple: true }}
            style={{ margin: "10px 0", height: "500px", width: "100%" }}
            sticky scroll={{ x: 400 }}
        />
    );
}

export default InvoiceDrugPage;