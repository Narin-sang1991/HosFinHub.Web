

import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { type TableColumnsType } from "antd";
import { OpdOperationModel, IpdOperationModel, instanceOfIpdOperations } from '@/store/operation/operationModel'
import { getOperType } from '@/client.constant/operation.constant';

interface ProcedureInfoProps {
    procedureItems: OpdOperationModel[] | IpdOperationModel[]
}

const ProcedureInfo = ({ procedureItems }: ProcedureInfoProps) => {

    const [isIPD, setIsIPD] = useState<boolean>(false);

    useEffect(() => {
        setIsIPD(instanceOfIpdOperations(procedureItems));
    }, [procedureItems]);

    const columnOpers: TableColumnsType<OpdOperationModel | IpdOperationModel> = [
        {
            key: 'oper',
            title: 'ICD9',
            dataIndex: 'oper'
        },
        {
            key: 'dropid',
            title: 'Doctor Code',
            dataIndex: 'dropid'
        },
    ]

    const columnOpdOpers: TableColumnsType<OpdOperationModel> = [
        {
            key: 'dateopd',
            title: 'วันที่บันทึก',
            dataIndex: 'dateopd'
        },
        ...columnOpers,
        {
            key: 'clinic',
            title: 'Clinic Code',
            dataIndex: 'clinic'
        },
        {
            key: 'servprice',
            title: 'ราคา',
            dataIndex: 'servprice'
        }
    ]

    const columnIpdOpers: TableColumnsType<IpdOperationModel> = [
        {
            key: 'datein',
            title: 'วันที่เริ่ม',
            dataIndex: 'datein'
        },
        {
            key: 'timein',
            title: 'เวลาที่เริ่ม',
            dataIndex: 'timein',
            render: (value) => <>{`${value.substring(0, 2)}:${value.substring(2, 4)}`}</>,
        },
        ...columnOpers,
        {
            key: 'optype',
            title: 'ชนิดของหัตถการ',
            dataIndex: 'optype',
            render: (value) => <>{getOperType(value)}</>,
        },
        {
            key: 'dateout',
            title: 'วันที่เสร็จสิ้น',
            dataIndex: 'dateout'
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
            <Table
                rowKey={(record) => record.seq}
                columns={isIPD ? columnIpdOpers : columnOpdOpers}
                dataSource={procedureItems || []}
                pagination={false}
                style={{ margin: -10, width: "99%" }}
                sticky
                scroll={{ x: 500 }}
            />
        </React.Fragment>
    )
}

export default ProcedureInfo