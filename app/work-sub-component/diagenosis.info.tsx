'use client'
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { type TableColumnsType } from "antd";
import moment from "moment";
import { IpdDianosisModel, OpdDianosisModel } from "@/store/dianosis/dianosisModel";
import { dateDisplayFormat } from "@/client.constant/format.constant";

interface DiagenosisInfoProps {
    isIPD: boolean
    diagenosisItems: OpdDianosisModel[] | IpdDianosisModel[]
}

const DiagenosisInfo = ({ diagenosisItems, isIPD }: DiagenosisInfoProps) => {

    const [diagenosisData, setData] = useState<any[]>();

    useEffect(() => {
        setData(diagenosisItems);
    }, [diagenosisItems]);

    const diagColumns = [
        {
            key: 'diag',
            title: 'รหัสโรค ICD10',
            dataIndex: 'diag'
        },
        {
            key: 'dxtype',
            title: 'ลำดับการวินิฉัย',
            dataIndex: 'dxtype'
        },
        {
            key: 'drdx',
            title: 'รหัสแพทย์ผู้วินิจฉัย',
            dataIndex: 'drdx'
        },
    ]

    const opdDiagColumns: TableColumnsType<OpdDianosisModel> = [
        {
            key: 'datedx',
            title: 'วันที่บันทึก',
            dataIndex: 'datedx',
            render: (date) => {
                return moment(new Date(date)).format("YYYY") === "1970" ? (
                    <></>
                ) : (
                    moment(date).format(dateDisplayFormat)
                );
            },
        },
        ...diagColumns,
        {
            key: 'clinic',
            title: 'รหัสคลีนิก',
            dataIndex: 'clinic'
        },
    ]

    const ipdDiagColumns: TableColumnsType<IpdDianosisModel> = [
        {
            key: 'an',
            title: 'เลขที่ admit',
            dataIndex: 'an',
        },
        ...diagColumns,
    ]

    return (
        <React.Fragment> 
             {
                isIPD ? <Table
                    rowKey={(record) => record.id}
                    columns={ipdDiagColumns}
                    dataSource={diagenosisData || []}
                    pagination={false}
                    style={{ margin: -10, width: "99%" }}
                    sticky
                    scroll={{ x: 500 }}
                />
                    : <Table
                        rowKey={(record) => record.id}
                        columns={opdDiagColumns}
                        dataSource={diagenosisData || []}
                        pagination={false}
                        style={{ margin: -10, width: "99%" }}
                        sticky
                        scroll={{ x: 500 }}
                    />
            }
        </React.Fragment>
    )
}

export default DiagenosisInfo