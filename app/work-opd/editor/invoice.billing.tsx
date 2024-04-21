"use client";

//#region Import
import React, { useState } from "react";
import { Button, Typography, Table, Statistic, Modal, Tag, Badge, Form } from "antd";
import type { TableColumnsType } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";
import { AdditionalPaymentModel, InvoiceEditorModel } from "@/store/financial/paymentModel";
import type { DrugEditorModel } from "@/store/patient/drugModel";
import {
    getStatusDisplayType,
    getClaimStatusText,
} from "@/client.constant/invoice.billing.constant";
import InvoiceDrugPage from "./invoice.drug";
import "@/app/globals.css";
//#endregion

type InvoiceBillingProps = {
    invoiceItems: InvoiceEditorModel[];
    drugItems: DrugEditorModel[];
    additPaymentItems?: AdditionalPaymentModel[];
};
const { Text } = Typography;

const InvoiceBillingTab = function InvoiceBilling({
    invoiceItems,
    drugItems,
    additPaymentItems
}: InvoiceBillingProps) {

    const [formBillingEditor] = Form.useForm();
    const [isModalDrugOpen, setModalDrugOpen] = useState(false);

    function takeAction(chargeCode: string) {
        if (chargeCode.startsWith("3") || chargeCode.startsWith("4"))
            setModalDrugOpen(true);
        return;
    }

    function saveInvoiceDrug(): void {
        const dataEditing = formBillingEditor.getFieldValue("InvoiceDrug");
        console.log('dataEditing=>', dataEditing);
        setModalDrugOpen(false);
    }

    //#region Local Filter Data
    const columns: TableColumnsType<InvoiceEditorModel> = [
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
            title: "ราคาเรียกเก็บ",
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
            title: "ส่วนเกิน",
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
            title: "จำนวนเงินที่อนุมัติ",
            dataIndex: "approvedAmount",
            key: "approvedAmount",
            width: 40,
            ellipsis: true,
            render: (approvedAmount) => (
                <Statistic
                    precision={2}
                    value={approvedAmount}
                    valueStyle={{
                        fontSize: "16px",
                        color: approvedAmount == 0 ? "gray" : "#3f8600",
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
            render: (_: any, record: InvoiceEditorModel) =>
                record.status == 0 ? (
                    <></>
                ) : (
                    <Button
                        type="primary"
                        ghost
                        block
                        style={{ border: 0 }}
                        icon={<FileDoneOutlined />}
                        onClick={() => takeAction(record.chargeCode)}
                    />
                ),
        },
        {
            title: <p className="Center">ตรวจสอบ</p>,
            key: "action",
            width: 20,
            fixed: "right",
            ellipsis: true,
            className: "Center",
            render: (_: any, record: InvoiceEditorModel) =>
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
                        onClick={() => takeAction(record.chargeCode)}
                    />
                ),
        },
    ];
    //#endregion

    return (
        <>
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={invoiceItems}
                size="small"
                className={"MasterBackground"}
                pagination={{ pageSize: 10 }}
                style={{ margin: -10, height: "400px", width: "100%" }}
                sticky
                scroll={{ x: 400 }}
            />
            <Modal
                title={`รายการเบิก (จำนวน ${drugItems.length || 0} รายการ)`}
                open={isModalDrugOpen}
                centered
                width={"90%"}
                onOk={saveInvoiceDrug}
                onCancel={() => setModalDrugOpen(false)}
            >
                <Form form={formBillingEditor}>
                    <Form.Item name="InvoiceDrug"   >
                        <InvoiceDrugPage drugItems={drugItems} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default InvoiceBillingTab;
