"use client";

import React from 'react';
import { Button, Typography, Table, InputNumber, } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { InvoiceItemModel } from '@/store/financial/paymentModel';
import { getChargeDetails } from "@/client.constant/payment.method.constant";
import '@/app/globals.css';

type InvoiceBillingProps = { invoiceItems: InvoiceItemModel[] }
const { Text } = Typography;

const InvoiceBillingTab = function InvoiceBilling({ invoiceItems }: InvoiceBillingProps) {

    //#region Local Filter Data
    const columns: TableColumnsType<InvoiceItemModel> = [
        {
            title: <Button type="primary" ghost block style={{ border: 0 }}
                icon={<PlusOutlined />}
            // onClick={() =>  )}
            />,
            key: "action",
            width: 15,
            fixed: 'left',
            render: (_: any, record: InvoiceItemModel) => (
                <Button type="primary" ghost block style={{ border: 0 }}
                    icon={<EditOutlined />}
                // onClick={() =>  )}
                />
            )
        },
        {
            title: "หมวด",
            dataIndex: "chrgitem",
            key: "chrgitem",
            width: 20,
            fixed: 'left',
            ellipsis: true,
            sorter: (a, b) => a.chrgitem.localeCompare(b.chrgitem),
        },
        {
            title: "รายการค่าบริการทางการแพทย์",
            key: "chrgitem-details",
            width: 80,
            ellipsis: true,
            render: (record) => (
                <>{getChargeDetails(record.chrgitem)}</>
            )
        },
        {
            title: "ราคาเรียกเก็บ",
            dataIndex: "amount",
            key: "amount",
            width: 40,
            ellipsis: true,
            render: (amount) => (
                <InputNumber value={amount} precision={2} readOnly />
            )
        },
        {
            title: "ส่วนเกิน",
            dataIndex: "over_amount",
            key: "over_amount",
            width: 40,
            ellipsis: true,
            render: (over_amount) => (
                <InputNumber value={over_amount || 0} precision={2} readOnly />
            )
        },
        {
            title: "จำนวนเงินที่อนุมัติ",
            dataIndex: "approve_amount",
            key: "approve_amount",
            width: 40,
            ellipsis: true,
            render: (approve_amount) => (
                <InputNumber value={approve_amount || 0} precision={2} readOnly />
            )
        },
        {
            title: "สถานะ",
            dataIndex: "approve_status",
            key: "approve_status",
            width: 30,
            fixed: 'right',
            ellipsis: true,
            render: (approve_status) => (
                <Text strong italic type={approve_status == '1' ? 'success'
                    : approve_status == '2' ? 'warning'
                        : approve_status == '3' ? 'danger' : 'secondary'} >
                    {approve_status || "-"}
                </Text>
            )
        },
    ]
    //#endregion

    return (
        <Table
            rowKey={record => record.id}
            columns={columns} dataSource={invoiceItems}
            size="small" className={"MasterBackground"}
            pagination={{ pageSize: 10, showSizeChanger: true }}
            style={{ margin: "10px 0", height: "500px", width: "100%" }}
            sticky scroll={{ x: 600 }}
        />
    );
}

export default InvoiceBillingTab;