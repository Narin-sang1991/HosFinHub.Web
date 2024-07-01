"use client";

//#region Import
import React, { useState, useEffect } from "react";
import { v1 as newUid } from "uuid";
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import moment from "moment";
import {
    Divider, Space, Table,
    Form, Tooltip, Button,
    Popconfirm,
    Select
} from "antd";
import { CheckOutlined, CloseOutlined, DeleteTwoTone, EditTwoTone, PlusSquareTwoTone, WarningOutlined } from "@ant-design/icons";
import type { TableColumnProps, TableProps } from "antd";
import AccidentEmergencyEditor from "./accident.emergency.editor";
import ReferInfo from "./refer.info";
import { AccidentEmergencyModel } from '@/store/refer/accidentEmergencyModel'
import { VisitDetailModel } from "@/store/work/workEditorModel";
import { dateDisplayFormat, dateInterfaceFormat, dateTimeDisplayFormat, timeInterfaceFormat, timeZoneOffset } from "@/client.constant/format.constant";
import { aeTypes, defaultReferObjective, emTypes, getAeTypes, getEmTypes, getUcase, suffixNewItem, uCaseItems } from "@/client.constant/emergency.refer.constant";
import { EditableCell } from "@/client.component/antd.table.editable";
import { primaryColor } from "@/client.constant/styles..component.constant";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
//#endregion

interface AccidentEmergencyProps {
    accidenEmergencyItems?: AccidentEmergencyModel[],
    insRefercl?: string,
    referType?: string,
    referDate?: string,
    visitDetail?: VisitDetailModel,
    onChange?: any,
}

const AccidentEmergencyTab = function AccidentEmergency({
    accidenEmergencyItems, insRefercl, referType, referDate,
    visitDetail, onChange }: AccidentEmergencyProps) {

    const [formEmergencyEditor] = Form.useForm();
    const [formReferDisplay] = Form.useForm();
    const [currentDateTime] = useState(new Date());
    const [editingKey, setEditingKey] = useState("");
    const [editingNew, setEditingNew] = useState(false);
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
        setDisplayFormRefer();
    }, [visitDetail, insRefercl, referType, referDate]);

    //#region Local Filter & Function
    function addItem(): void {
        let newItem: AccidentEmergencyModel = {
            id: newUid() + suffixNewItem,
            hn: visitDetail?.hn || "0",
            an: visitDetail ? (visitDetail.isIPD == true ? visitDetail.an : "") : "0",
            dateopd: visitDetail?.visitDate || currentDateTime,
            refer_no: "",
            refmaini: "",
            ireftype: "",
            refmaino: "",
            oreftype: "",
            seq: visitDetail?.seq || "0",
            aestatus: "",
            dalert: "",
            talert: ""
        };

        let tmpItem = [...editingItems || []];
        tmpItem.push(newItem)
        setEditingItems(tmpItem);
        setEditingNew(true);
        editItem(newItem);
    };

    function setDisplayFormRefer(): void {
        formReferDisplay.setFieldsValue({
            insRefercl, referType, referDate,
            clinic: visitDetail?.clinic,
        });
    }

    function editItem(record: Partial<AccidentEmergencyModel>): void {
        let aedate = moment(record.aedate || currentDateTime).utcOffset(timeZoneOffset).format(dateDisplayFormat);
        let recordTime = currentDateTime;
        if (record.aetime) {
            recordTime.setHours(Number(record.aetime.substring(0, 2)))
            recordTime.setMinutes(Number(record.aetime.substring(2, 4)));
        }
        let aetime = moment(recordTime).utcOffset(timeZoneOffset).format(dateTimeDisplayFormat);
        formEmergencyEditor.setFieldsValue({
            ...record,
            aedate: dayjs(aedate),
            aetime: dayjs(aetime),
        });
        setEditingKey(record?.id || "");
    };

    async function saveItem(key: React.Key): Promise<void> {
        if (editingItems == undefined) return;

        const row = (await formEmergencyEditor.validateFields()) as AccidentEmergencyModel;
        let tmpItems = [...editingItems];
        const index = tmpItems.findIndex((item) => key == item.id);
        if (index < 0) return;
        ;
        const item = tmpItems[index];
        tmpItems.splice(index, 1, {
            ...item,
            aedate: row.aedate ? dayjs(row.aedate, dateInterfaceFormat).format(dateInterfaceFormat) : undefined,
            aetime: row.aedate ? dayjs(row.aetime, timeInterfaceFormat).format(timeInterfaceFormat) : undefined,
            authae: row.authae,
            ucae: row.ucae,
            emtype: row.emtype,
            aetype: row.aetype,
        });
        setEditingItems(tmpItems);
        setEditingKey("");
        setEditingNew(false);
        if (onChange) onChange({ accidenEmergencyItems: tmpItems });
    }

    function deleteItem(key: React.Key): void {
        let tmpItems = [...editingItems || []];
        const index = tmpItems.findIndex(t => t.id == key);
        if (index <= -1) return;

        tmpItems.splice(index, 1);
        setEditingItems(tmpItems);

        if (onChange && editingNew == false) onChange({ accidenEmergencyItems: tmpItems });
    }

    function cancel(): void {
        if (editingNew == true) {
            deleteItem(editingKey);
            setEditingNew(false);
        }
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
            editable: true,
            render: (aedate?: string) => aedate ? moment(aedate).format(dateDisplayFormat) : "",
        },
        {
            key: 'aetime',
            title: 'เวลาที่เกิดอุบัติเหตุ',
            dataIndex: 'aetime',
            fixed: "left",
            width: 40,
            editable: true,
            render: (aetime?: string) => aetime ? `${aetime.substring(0, 2)}:${aetime.substring(2, 4)}` : "",
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
            selectorNode: <Select dropdownStyle={{ minWidth: '280px' }}
                options={emTypes.map(t => { return { label: t.text, value: t.key.toString() } })}
            />,
            editable: true,
            required: true,
            render: (emtype?: string) => emtype ? getEmTypes(emtype) : "",
        },
        {
            key: 'aetype',
            title: 'สิทธิ์การรักษาอื่น',
            dataIndex: 'aetype',
            width: 40,
            selectorNode: <Select dropdownStyle={{ minWidth: '280px' }}
                options={aeTypes.map(t => { return { label: t.text, value: t.key.toString() } })}
            />,
            editable: true,
            render: (aetype?: string) => aetype ? getAeTypes(aetype) : "",
        },
        {
            title: (<p className="Center"><Tooltip title="เพิ่มรายการ[อุบัติเหตุ]"><Button
                disabled={viewMode == false} onClick={addItem}
                type="text" block
                icon={<PlusSquareTwoTone twoToneColor={primaryColor} style={{ fontSize: '20px' }} />}
            /></Tooltip></p>),
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
                            type="text" block size="small"
                            icon={<CheckOutlined style={{ color: primaryColor }} />}
                        />
                        <Divider type="vertical" />
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
                ) : (<Space size="middle">
                    <Tooltip title="แก้ไข">
                        <Button
                            disabled={!viewMode}
                            onClick={() => editItem(record)}
                            type="text" size="small" block
                            icon={<EditTwoTone />}
                        />
                    </Tooltip>
                    <Divider type="vertical" />
                    <Popconfirm okText="ใช่" cancelText="ไม่"
                        title="แน่ใจการ[ลบ] ?"
                        placement="bottom"
                        onConfirm={() => deleteItem(record.id)}
                    >
                        <Tooltip title="ลบรายการ[อุบัติเหตุ]" style={{ margin: 0 }}>
                            <Button
                                disabled={viewMode == false}
                                type="text" size="small" block danger
                                icon={<DeleteTwoTone key="btDeleteIcon" style={{ margin: 0 }} twoToneColor={"#ff0000"} />}
                            />
                        </Tooltip>
                    </Popconfirm>

                </Space>
                );
            }
        },
    ];

    const mergedColumns: TableProps["columns"] = columns.map((col) => {
        if (!col.editable) {
            return { ...col } as TableColumnProps<AccidentEmergencyModel>;
        }
        const selectorTypes = ["ucae", "emtype", "aetype"];
        return {
            ...col,
            onCell: (record: AccidentEmergencyModel) => ({
                record,
                inputType: selectorTypes.includes(col.dataIndex) ? "selector"
                    : col.dataIndex == "aedate" ? "date"
                        : col.dataIndex == "aetime" ? "time"
                            : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                isRequired: col.required,
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
            <Space direction="vertical" size="small" >
                <Form name="formEmergencyEditor" form={formEmergencyEditor} component={false} >
                    <Table
                        rowKey={(record) => record.id}
                        components={{
                            body: {
                                cell: EditableCell<AccidentEmergencyModel>,
                            },
                        }}
                        columns={mergedColumns}
                        dataSource={editingItems}
                        size="small" pagination={false}
                        style={{ marginLeft: -10, marginTop: 0, height: "150px", width: "100%" }}
                        locale={{
                            emptyText: "ไม่มีข้อมูลอุบัติเหตุ"
                        }}
                        sticky scroll={{ x: 350 }}
                    />
                </Form>
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
                    <ReferInfo isIPD={visitDetail?.isIPD || false} />
                </Form>
            </Space>
        </React.Fragment >
    )
}

export default AccidentEmergencyTab