"use client";

//#region Import
import React from "react"
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { AccidentEmergencyModel } from '@/store/refer/accidentEmergencyModel'
//#endregion

interface AccidentEmergencyProps {
    accidentEmergencies: AccidentEmergencyModel[]
}


const AccidentEmergencyTab = function AccidentEmergency({ accidentEmergencies }: AccidentEmergencyProps) {

    //#region Local Filter Data
    const columns: TableColumnsType<AccidentEmergencyModel> = [
        {
            key: 'dateopd',
            title: 'วันเข้ารับบริการ',
            dataIndex: 'dateopd',
            fixed: "left",
        },
        {
            key: 'aedate',
            title: 'วันที่เกิดอุบัติเหตุ',
            dataIndex: 'aedate',
            fixed: "left",
        },
        {
            key: 'aetime',
            title: 'เวลาที่เกิดอุบัติเหตุ',
            dataIndex: 'aetime',
            fixed: "left",
        },
        {
            key: 'emtype',
            title: 'รหัสบ่งชี้ความเร่งด่วน',
            dataIndex: 'emtype',
            fixed: "left",
        },
        {
            key: 'ucae',
            title: 'รหัสบ่งบอกการรักษา',
            dataIndex: 'ucae',
            fixed: "left",
        },
        {
            key: 'aetype',
            title: 'สิทธิ์การรักษาอื่น',
            dataIndex: 'aetype'
        },
        {
            key: 'refer_no',
            title: 'เลขที่ใบส่งต่อ',
            dataIndex: 'refer_no'
        },
        {
            key: 'refmaini',
            title: 'โรงพยาบาลต้นทาง',
            dataIndex: 'refmaini'
        },
        {
            key: 'ireftype',
            title: 'วัตถุประสงค์ที่รับเข้า',
            dataIndex: 'ireftype'
        },
        {
            key: 'refmaino',
            title: 'โรงพยาบาลที่ส่งต่อ',
            dataIndex: 'refmaino'
        },
        {
            key: 'oreftype',
            title: 'วัตถุประสงค์ที่ส่งต่อ',
            dataIndex: 'oreftype'
        },

    ]
    //#endregion

    return (
        <React.Fragment>
            <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={accidentEmergencies}
                size="small" pagination={false}
                style={{ marginTop: -10, height: "300px", width: "100%" }}
                sticky scroll={{ x: 350 }}
            />
        </React.Fragment>
    )
}

export default AccidentEmergencyTab