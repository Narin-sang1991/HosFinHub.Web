
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { type TableColumnsType } from "antd";
import moment from "moment";
import { OpdOperationModel, IpdOperationModel, } from '@/store/operation/operationModel'
import { getOperType } from '@/client.constant/operation.constant';
import { dateDisplayFormat } from "@/client.constant/format.constant";

interface ProcedureInfoProps {
    isIPD: boolean
    procedureItems: OpdOperationModel[] | IpdOperationModel[]
}

const ProcedureInfo = ({ procedureItems, isIPD }: ProcedureInfoProps) => {

    const [procedureData, setData] = useState<any[]>();

    useEffect(() => {
        setData(procedureItems);
    }, [procedureItems]);


    const operColumns = [
        {
            key: 'oper',
            title: 'รหัสโรค ICD9',
            dataIndex: 'oper'
        },
        {
            key: 'dropid',
            title: 'รหัสแพทย์ที่ทำหัตถการ',
            dataIndex: 'dropid'
        },
    ]

    const opdOperColumns: TableColumnsType<OpdOperationModel> = [
        {
            key: 'dateopd',
            title: 'วันที่บันทึก',
            dataIndex: 'dateopd',
            render: (date) => {
                return moment(new Date(date)).format("YYYY") === "1970" ? (
                    <></>
                ) : (
                    moment(date).format(dateDisplayFormat)
                );
            },
        },
        ...operColumns,
        {
            key: 'clinic',
            title: 'รหัสคลีนิก',
            dataIndex: 'clinic'
        },
        {
            key: 'servprice',
            title: 'ราคา',
            dataIndex: 'servprice'
        }
    ]

    const ipdOperColumns: TableColumnsType<IpdOperationModel> = [
        {
            key: 'datein',
            title: 'วันที่เริ่ม',
            dataIndex: 'datein',
            render: (date) => {
                return moment(new Date(date)).format("YYYY") === "1970" ? (
                    <></>
                ) : (
                    moment(date).format(dateDisplayFormat)
                );
            },
        },
        {
            key: 'timein',
            title: 'เวลาที่เริ่ม',
            dataIndex: 'timein',
            render: (value) => <>{`${value.substring(0, 2)}:${value.substring(2, 4)}`}</>,
        },
        ...operColumns,
        {
            key: 'optype',
            title: 'ชนิดของหัตถการ',
            dataIndex: 'optype',
            render: (value) => <>{getOperType(value)}</>,
        },
        {
            key: 'dateout',
            title: 'วันที่เสร็จสิ้น',
            dataIndex: 'dateout',
            render: (date) => {
                return moment(new Date(date)).format("YYYY") === "1970" ? (
                    <></>
                ) : (
                    moment(date).format(dateDisplayFormat)
                );
            },
        },
        {
            key: 'timeout',
            title: 'เวลาที่เสร็จสิ้น',
            dataIndex: 'timeout',
            render: (value) => <>{`${value.substring(0, 2)}:${value.substring(2, 4)}`}</>,
        },
    ]

    return (
        <React.Fragment>
            {
                isIPD ? <Table
                    rowKey={(record) => record.id}
                    columns={ipdOperColumns}
                    dataSource={procedureData || []}
                    pagination={false}
                    style={{ margin: -10, width: "99%" }}
                    sticky
                    scroll={{ x: 500 }}
                />
                    : <Table
                        rowKey={(record) => record.id}
                        columns={opdOperColumns}
                        dataSource={procedureData || []}
                        pagination={false}
                        style={{ margin: -10, width: "99%" }}
                        sticky
                        scroll={{ x: 500 }}
                    />
            }
        </React.Fragment>
    )
}

export default ProcedureInfo