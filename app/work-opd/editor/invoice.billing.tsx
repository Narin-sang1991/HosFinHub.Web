"use client";

//#region Import
import React, { useState, useEffect } from "react";
import { Button, Typography, Table, Statistic, Modal, Tag, Badge, Form, Space } from "antd";
import type { TableColumnsType } from "antd";
import { FileDoneOutlined, FileExclamationTwoTone } from "@ant-design/icons";
import { InvoiceEditorModel } from "@/store/financial/invoiceModel";
import { AdditPaymentModelEditorModel } from "@/store/free-additional/additionalModel";
import type { InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import { MoveInvoiceItemModel } from "@/store/financial/moveItemModel";
import {
    getStatusDisplayType, getClaimStatusText,
    drugFileCode, drugInChargePrefix, drugExChargePrefix,
    additionalPaymentFileCode, additionalPaymentChargePrefix, adpTypeNonGroup,
    recalcDrugCharges, recalcAdpCharges,
} from "@/client.constant/invoice.billing.constant";
import { getAdpDisplay } from "@/client.constant/invoice.addit.payment.constant";
import InvoiceDrugPage from "./invoice.drug";
import InvoiceAdditionalPage from "./invoice.additional";
import "@/app/globals.css";
//#endregion

type InvoiceBillingProps = {
    seqKey: number,
    clinicCode?: string,
    invoiceItems: InvoiceEditorModel[],
    drugItems: InvoiceDrugEditorModel[],
    additPaymentItems?: AdditPaymentModelEditorModel[],
    onChange?: any,
};
const { Text } = Typography;

const InvoiceBillingTab = function InvoiceBilling({
    seqKey, clinicCode,
    invoiceItems, drugItems, additPaymentItems,
    onChange,
}: InvoiceBillingProps) {

    const [formBillingEditor] = Form.useForm();
    const [invoiceData, setInvoiceData] = useState<InvoiceEditorModel[]>(invoiceItems);
    const [drugData, setDruData] = useState<InvoiceDrugEditorModel[]>(drugItems);
    const [additPaymentData, setAdditPaymentData] = useState<AdditPaymentModelEditorModel[]>(additPaymentItems || []);
    const [isModalDrugOpen, setModalDrugOpen] = useState(false);
    const [isAdditPaymentOpen, setModalAdditPaymentOpen] = useState(false);

    // useEffect(() => {
    //     formBillingEditor.resetFields(["InvoiceAdp"]);
    //     recalcAdpCharges({
    //         seqKey,
    //         invoiceEditors: invoiceData,
    //         adtEditors: additPaymentData,
    //         reconcile: false
    //     }).then((invoiceUtdAdp) => {
    //         recalcDrugCharges({
    //             seqKey,
    //             invoiceEditors: invoiceUtdAdp,
    //             drugEditors: drugData,
    //         }).then((invoiceUtdDrug) => {
    //             setInvoiceData(invoiceUtdDrug);
    //         });
    //     });
    // }, [additPaymentData, drugData]);
    useEffect(() => {
        formBillingEditor.resetFields(["InvoiceAdp"]);
        recalcAdpCharges({
            seqKey,
            invoiceEditors: invoiceData,
            adtEditors: additPaymentData,
            reconcile: false
        }).then((invoiceUtdAdp) => {
            setInvoiceData(invoiceUtdAdp);
        });
    }, [additPaymentData]);

    useEffect(() => {
        recalcDrugCharges({
            seqKey,
            invoiceEditors: invoiceData,
            drugEditors: drugData,
        }).then((invoiceUtdDrug) => {
            setInvoiceData(invoiceUtdDrug);
        });
    }, [drugData]);
    //#region Editor
    function takeAction(chargeCode: string) {
        if (chargeCode.startsWith(drugInChargePrefix) || chargeCode.startsWith(drugExChargePrefix)) {
            setModalDrugOpen(true);
            return;
        }

        if (chargeCode.startsWith(additionalPaymentChargePrefix)) {
            setModalAdditPaymentOpen(true);
            return;
        }
    }

    async function saveInvoiceDrug(): Promise<void> {
        const drugEditing = formBillingEditor.getFieldValue("InvoiceDrug");
        setDruData(drugEditing.drugItems);
        if (drugEditing.moveInvoiceItems.length > 0) {
            let moveInvoiceItems = drugEditing.moveInvoiceItems as MoveInvoiceItemModel[];
            let newPaymentData = await MoveDrugTo(moveInvoiceItems.filter(t => t.sourceFileID === drugFileCode));
            setAdditPaymentData(newPaymentData);
            // let invoiceAfterCalcAdp = await recalcAdpCharges({
            //     seqKey,
            //     invoiceEditors: invoiceData,
            //     adtEditors: newPaymentData,
            //     reconcile: false
            // });
            // let invoiceAfterCalcAdp = await recalcDrugCharges
        } else {
            setAdditPaymentData(additPaymentItems || []);
        }
        setModalDrugOpen(false);
    }

    const MoveDrugTo = async (drugMoveItems: MoveInvoiceItemModel[]) => {
        let newPaymentData = [...additPaymentData];
        let drugMoveToAdpItems = drugMoveItems.filter(t => t.chargeCodeTo.startsWith(additionalPaymentChargePrefix));
        await drugMoveToAdpItems.forEach(t => {
            let drugIndex = drugItems.findIndex(d => d.id === t.id);
            if (drugIndex < 0) return;

            let drug = drugItems[drugIndex];
            let newItem: AdditPaymentModelEditorModel = {
                dummyKey: (newPaymentData?.length || 0) + 1,
                totalreq: 0.00,
                idDurty: false,
                hasError: drug.hasError,
                id: drug.id,
                seq: seqKey,
                hn: drug.hn,
                dateopd: drug.date_serv,
                type: adpTypeNonGroup,
                typeDisplay: getAdpDisplay(adpTypeNonGroup),
                code: drug.did,
                freeDrug: { id: drug.id, code: drug.did, name: drug.didname, unitPrice: drug.drugprice.toString() },
                qty: drug.amount,
                rate: drug.drugprice,
                dose: drug.unit,
                total: drug.total,
                totcopay: drug.totcopay,
                clinic: clinicCode || "09900",
                itemsrc: 2,
            };
            let adpIndex = newPaymentData.findIndex(a => a.id === t.id);
            if (adpIndex < 0) {
                newPaymentData.push(newItem);
            } else {
                let adpItem = newPaymentData[adpIndex];
                newPaymentData.splice(adpIndex, 1, {
                    ...adpItem,
                    ...newItem,
                    dummyKey: adpItem.dummyKey,
                });
            }
        });
        return newPaymentData;
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
            title: "ขอเบิก",
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
            title: "เบิกได้",
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
            title: "เบิกไม่ได้",
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
                        {`ข้อมูลการใช้ยา (จำนวน ${drugData.length || 0} รายการ)`}
                    </Space>}
                    open={isModalDrugOpen} centered width={"90%"}
                    onCancel={() => setModalDrugOpen(false)} cancelText={"ปิด"}
                    onOk={saveInvoiceDrug} okText="นำไปใช้"
                >
                    <Form.Item name="InvoiceDrug">
                        <InvoiceDrugPage drugItems={drugItems} />
                    </Form.Item>
                </Modal>
                <Modal
                    title={<Space>
                        <FileExclamationTwoTone twoToneColor="#ffab00" />
                        {`ค่าใช้จ่ายเพิ่มเติ่ม (จำนวน ${additPaymentData.length || 0} รายการ)`}
                    </Space>}
                    open={isAdditPaymentOpen} centered width={"90%"}
                    onCancel={() => setModalAdditPaymentOpen(false)} cancelText={"ปิด"}
                    onOk={saveInvoiceDrug}
                    okText="นำไปใช้"
                >
                    <Form.Item name="InvoiceAdp">
                        <InvoiceAdditionalPage additionalItems={additPaymentData} />
                    </Form.Item>
                </Modal>
            </Form>
        </>
    );
};

export default InvoiceBillingTab;
