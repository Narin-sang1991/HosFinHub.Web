"use client";

//#region Import
import React, { useState, useEffect } from "react";
import { Button, Typography, Table, Statistic, Modal, Tag, Badge, Form, Space } from "antd";
import type { TableColumnsType } from "antd";
import { FileDoneOutlined, FileExclamationTwoTone } from "@ant-design/icons";
import { AdditionalPaymentModel, InvoiceEditorModel } from "@/store/financial/paymentModel";
import type { DrugEditorModel } from "@/store/patient/drugModel";
import { MoveInvoiceItemModel } from "@/store/financial/moveItemModel";
import {
    getStatusDisplayType, getClaimStatusText,
    drugFileCode, drugInChargePrefix, drugExChargePrefix,
    additionalPaymentFileCode, additionalPaymentChargePrefix,
    adpTypeNonGroup,
} from "@/client.constant/invoice.billing.constant";
import InvoiceDrugPage from "./invoice.drug";
import "@/app/globals.css";
//#endregion

type InvoiceBillingProps = {
    clinicCode?: string,
    invoiceItems: InvoiceEditorModel[],
    drugItems: DrugEditorModel[],
    additPaymentItems?: AdditionalPaymentModel[],
    onChange?: any,
};
const { Text } = Typography;

const InvoiceBillingTab = function InvoiceBilling({
    invoiceItems,
    drugItems,
    additPaymentItems,
    clinicCode,
    onChange,
}: InvoiceBillingProps,) {

    const [formBillingEditor] = Form.useForm();
    const [invoiceData, setInvoiceData] = useState<InvoiceEditorModel[]>([]);
    const [drugData, setDruData] = useState<DrugEditorModel[]>([]);
    const [additPaymentData, setAdditPaymentData] = useState<AdditionalPaymentModel[]>([]);
    const [isModalDrugOpen, setModalDrugOpen] = useState(false);

    useEffect(() => {
        setInvoiceData(invoiceItems);
    }, [invoiceItems]);
    useEffect(() => {
        setDruData(drugItems);
    }, [drugItems]);
    useEffect(() => {
        setAdditPaymentData(additPaymentItems || []);
    }, [additPaymentItems]);

    //#region Editor
    function takeAction(chargeCode: string) {
        if (chargeCode.startsWith("3") || chargeCode.startsWith("4")) setModalDrugOpen(true)    // infoInvoiceDrug();
        return;
    }

    async function saveInvoiceDrug(): Promise<void> {
        const drugEditing = formBillingEditor.getFieldValue("InvoiceDrug");
        console.log('dataEditing=>', drugEditing);
        setDruData(drugEditing.drugItems);
        if (drugEditing.moveInvoiceItems.length > 0) {
            let moveInvoiceItems = drugEditing.moveInvoiceItems as MoveInvoiceItemModel[];

            await MoveDrugTo(moveInvoiceItems.filter(t => t.sourceFileID === drugFileCode));

        }
    }

    const MoveDrugTo = async (drugMoveItems: MoveInvoiceItemModel[]) => {
        let temp = [...additPaymentData];
        let drugMoveToAdpItems = drugMoveItems.filter(t => t.chargeCodeTo.startsWith(additionalPaymentChargePrefix));
        drugMoveToAdpItems.forEach(t => {
            let drugIndex = drugItems.findIndex(d => d.id === t.id);
            if (drugIndex < 0) return;

            let drug = drugItems[drugIndex];
            let newItem: AdditionalPaymentModel = {
                id: drug.id,
                seq: drug.seq,
                hn: drug.hn,
                dateopd: drug.date_serv,
                type: adpTypeNonGroup,
                code: drug.didname,
                qty: drug.amount,
                rate: drug.drugprice,
                total: drug.total,
                totcopay: drug.totcopay,
                clinic: clinicCode || "09900",
                itemsrc : 2,
            }
            temp.push(newItem);
        });
        setAdditPaymentData(temp);
    }
    //#endregion

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

    //#region const component internal
    const infoInvoiceDrug = () => {
        Modal.info({
            title: `รายการเบิก (จำนวน ${drugItems.length || 0} รายการ)`,
            centered: true,
            okText: 'นำไปใช้',
            closable: true,
            width: "90%",
            icon: <FileExclamationTwoTone twoToneColor="#ffab00" />,
            content: (
                <Form.Item name="InvoiceDrug"   >
                    <InvoiceDrugPage
                    //  drugItems={drugItems}
                    />
                </Form.Item>
            ),
            okButtonProps: { ghost: true },
            onOk() { saveInvoiceDrug(); },
        });
    };
    //#endregion

    return (
        <>
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={invoiceData}
                size="small"
                className={"MasterBackground"}
                pagination={{ pageSize: 10 }}
                style={{ margin: -10, height: "400px", width: "100%" }}
                sticky
                scroll={{ x: 400 }}
            />
            <Form form={formBillingEditor} >
                <Modal
                    title={<Space>
                        <FileExclamationTwoTone twoToneColor="#ffab00" />
                        {`รายการเบิก (จำนวน ${drugItems.length || 0} รายการ)`}
                    </Space>}
                    open={isModalDrugOpen} centered width={"90%"}
                    onCancel={() => setModalDrugOpen(false)} cancelText={"ปิด"}
                    onOk={saveInvoiceDrug} okText="นำไปใช้"
                >
                    <Form.Item name="InvoiceDrug"   >
                        <InvoiceDrugPage drugItems={drugData} />
                    </Form.Item>
                </Modal>
            </Form>
        </>
    );
};

export default InvoiceBillingTab;
