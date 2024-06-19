"use client";

//#region Import
import React, { useState, useEffect } from "react"
import moment from "moment";
import {
    Divider, Space, Table,
    Form, Tooltip, Button,
    Popconfirm,
    Select
} from "antd";
import { CheckOutlined, CloseOutlined, EditTwoTone } from "@ant-design/icons";
import type { TableColumnProps, TableProps } from "antd";
import AccidentEmergencyEditor from "./accident.emergency.editor";
import ReferInfo from "./refer.info";
import { AccidentEmergencyModel } from '@/store/refer/accidentEmergencyModel'
import { dateDisplayFormat } from "@/client.constant/format.constant";
import { defaultReferObjective, getAeTypes, getEmTypes, getUcase, uCaseItems } from "@/client.constant/emergency.refer.constant";
import { EditableCell } from "@/client.component/antd.table.editable";
//#endregion

interface AccidentEmergencyProps {
    accidenEmergencyItems?: AccidentEmergencyModel[],
    clinic?: string,
    insRefercl?: string,
    referType?: string,
    referDate?: string,
    onChange?: any,
}

const AccidentEmergencyTab = function AccidentEmergency({
    accidenEmergencyItems,
    clinic, insRefercl, referType, referDate,
    onChange }: AccidentEmergencyProps) {

    const [formEmergencyEditor] = Form.useForm();
    const [formReferDisplay] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const [editingItems, setEditingItems] = useState<AccidentEmergencyModel[]>();
    const [referIn, setReferIn] = useState<AccidentEmergencyModel>();
    const [referOut, setReferOut] = useState<AccidentEmergencyModel>();

    const isEditing = (record: AccidentEmergencyModel) => record.id === editingKey;
    const viewMode = editingKey === "";

    useEffect(() => {
        setEditingItems(accidenEmergencyItems);

        let aerIn: AccidentEmergencyModel | undefined = (accidenEmergencyItems || []).find(t => t.refmaini != '' && t.refmaino == '');
        setReferIn(aerIn);

        let aerOut: AccidentEmergencyModel | undefined = (accidenEmergencyItems || []).find(t => t.refmaini == '' && t.refmaino != '');
        setReferOut(aerOut);
    }, [accidenEmergencyItems]);

    useEffect(() => {
        setDisplayFormRefer();;
    }, [clinic, insRefercl, referType, referDate]);


    //#region Local Filter & Function
    function setDisplayFormRefer(): void {
        formReferDisplay.setFieldsValue({
            clinic, insRefercl, referType, referDate,
        });
    }

    function editItem(record: Partial<AccidentEmergencyModel>): void {
        formEmergencyEditor.setFieldsValue({ ...record });
        setEditingKey(record?.id || "");
    };

    async function saveItem(key: React.Key): Promise<void> {
        if (editingItems == undefined) return;

        const row = (await formEmergencyEditor.validateFields()) as AccidentEmergencyModel;
        let tmpItems = [...editingItems];
        const index = tmpItems.findIndex((item) => key == item.id);
        if (index < 0) return;

        const item = tmpItems[index];
        tmpItems.splice(index, 1, {
            ...item,
            authae: row.authae,
            ucae: row.ucae,
        });
        setEditingItems(tmpItems);
        setEditingKey("");
        if (onChange) onChange({ accidenEmergencyItems: tmpItems });
    }

    const cancel = () => {
        clearEditingItem();
    };

    function clearEditingItem(): void {
        formEmergencyEditor.resetFields();
        setEditingKey("");
    };

    const columns = [
        {
            key: 'aedate',
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'aedate',
            fixed: "left",
            width: 50,
            render: (aedate?: string) => aedate ? moment(aedate).format(dateDisplayFormat) : "",
        },
        {
            key: 'aetime',
            title: 'เวลาที่เกิดอุบัติเหตุ',
            dataIndex: 'aetime',
            fixed: "left",
            width: 40,
        },
        {
            key: 'authae',
            title: 'Claim Code',
            dataIndex: 'authae',
            fixed: "left",
            width: 40,
            editable: true,
        },
        {
            key: 'ucae',
            title: 'รหัสบ่งบอกการรักษา',
            dataIndex: 'ucae',
            fixed: "left",
            width: 60,
            selectorNode: <Select dropdownStyle={{ minWidth: '280px' }}
                options={uCaseItems.map(t => { return { label: t.text, value: t.key.toString() } })}
            />,
            editable: true,
            render: (ucae?: string) => ucae ? getUcase(ucae) : "",

        },
        {
            key: 'emtype',
            title: 'รหัสบ่งชี้ความเร่งด่วน',
            dataIndex: 'emtype',
            width: 40,
            render: (emtype?: string) => emtype ? getEmTypes(emtype) : "",
        },
        {
            key: 'aetype',
            title: 'สิทธิ์การรักษาอื่น',
            dataIndex: 'aetype',
            width: 40,
            render: (aetype?: string) => aetype ? getAeTypes(aetype) : "",
        },
        {
            title: "",
            dataIndex: "operation",
            fixed: 'right',
            width: 30,
            render: (_: any, record: AccidentEmergencyModel) => {
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
                    <Tooltip title="แก้ไข">
                        <Button
                            disabled={!viewMode}
                            onClick={() => editItem(record)}
                            type="text" size="small" block
                            icon={<EditTwoTone />}
                        />
                    </Tooltip>
                );
            }
        },
    ];

    const mergedColumns: TableProps["columns"] = columns.map((col) => {
        if (!col.editable) {
            return { ...col } as TableColumnProps<AccidentEmergencyModel>;
        }

        return {
            ...col,
            onCell: (record: AccidentEmergencyModel) => ({
                record,
                inputType: col.dataIndex == "ucae" ? "selector" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                selectorNode: col.selectorNode
            }),
        } as TableColumnProps<AccidentEmergencyModel>;
    });

    function triggerChange(changedData: AccidentEmergencyModel, claimReferData: boolean): void {
        if (editingItems == undefined) return;
        let tmpItems = [...editingItems];
        const index = tmpItems.findIndex(t => t.id == changedData.id);
        if (claimReferData == false) formReferDisplay.resetFields();
        if (claimReferData == true) setDisplayFormRefer();
        if (claimReferData == false && changedData.ireftype != "") changedData.ireftype = defaultReferObjective;
        if (claimReferData == false && changedData.oreftype != "") changedData.oreftype = defaultReferObjective;
        if (index > -1) {
            const item = tmpItems[index];
            tmpItems.splice(index, 1, {
                ...item,
                ireftype: changedData.ireftype,
                oreftype: changedData.oreftype,
            });
            setEditingItems(tmpItems);
        }
        if (onChange) onChange({ accidenEmergencyItems: tmpItems });
    }
    //#endregion

    return (
        <React.Fragment>
            <Form name="formEmergencyEditor" form={formEmergencyEditor} component={false}>
                <Table
                    rowKey={(record) => record.id}
                    components={{
                        body: {
                            cell: EditableCell<AccidentEmergencyModel>,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={editingItems}
                    size="small" pagination={false} bordered
                    style={{ marginLeft: -10, marginTop: 0, height: "150px", width: "100%" }}
                    sticky scroll={{ x: 350 }}
                />
            </Form>
            <Space direction="vertical" size="small" >
                <Divider orientation="left" plain style={{ margin: 0 }}><h4>รับเข้า</h4></Divider>
                <AccidentEmergencyEditor key='refer-in'
                    accidentEmergency={referIn} isReferIn={true}
                    onChange={triggerChange}
                />
                <Divider orientation="left" plain style={{ margin: 0 }}><h4>ส่งต่อ</h4></Divider>
                <AccidentEmergencyEditor key='refer-out'
                    accidentEmergency={referOut} isReferIn={false}
                    onChange={triggerChange}
                />
                <Form name="formReferDisplay" form={formReferDisplay} layout="horizontal" >
                    <ReferInfo isIPD={false} />
                </Form>
            </Space>
        </React.Fragment >
    )
}

export default AccidentEmergencyTab