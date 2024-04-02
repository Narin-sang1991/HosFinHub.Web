"use client";

import React from 'react';
import { Button, Typography, Table, InputNumber, } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { DrugEditorModel } from '@/store/patient/drugModel';
import { getStatusDisplayType, getClaimStatusText } from "@/client.constant/invoice.billing.constant";
import '@/app/globals.css';

type InvoiceDrugProps = { drugItems: DrugEditorModel[] }
const { Text } = Typography;

const InvoiceDrugPage = function InvoiceDrug({ drugItems }: InvoiceDrugProps) {

    //#region Local Filter Data
    const columns: TableColumnsType<DrugEditorModel> = [
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
            render: (status) => (
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
        },
        {
            title: 'ส่วนเกิน',
            dataIndex: "totcopay",
            key: "totcopay",
            width: 30,
            ellipsis: true,
        },
        // {
        //     title: "รายการค่าบริการทางการแพทย์",
        //     key: "chrgitem-details",
        //     width: 80,
        //     ellipsis: true,
        //     render: (record) => (
        //         <>{getChargeDetails(record.chrgitem)}</>
        //     )
        // },

    ]
    //#endregion

    return (
        <Table
            rowKey={record => record.id}
            columns={columns} dataSource={drugItems}
            size="small" className={"MasterBackground"}
            pagination={{ pageSize: 10, simple:true }}
            style={{ margin: "10px 0", height: "500px", width: "100%" }}
            sticky scroll={{ x: 400 }}
        />
    );
}

export default InvoiceDrugPage;