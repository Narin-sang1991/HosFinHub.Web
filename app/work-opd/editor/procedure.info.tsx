import { OopModel } from '@/store/financial/opdModel'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

interface ProcedureInfoProps {
    procedureInfo: OopModel[]
}

const ProcedureInfo = (props: ProcedureInfoProps) => {
    const [procedure, setProcedure] = useState<OopModel[]>([])

    useEffect(() => {
        getProcedure(props.procedureInfo)
    }, [props])

    const getProcedure = (value: OopModel[]) => {
        setProcedure(value)
    }

    const column = [
        {
            key: 'dateopd',
            title: 'วันที่บันทึก',
            dataIndex: 'dateopd'
        },
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

    return (
        <React.Fragment>
            <Table columns={column} dataSource={procedure} pagination={false} />
        </React.Fragment>
    )
}

export default ProcedureInfo