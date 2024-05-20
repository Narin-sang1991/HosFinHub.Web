import { OpdOperationModel,IpdOperationModel } from '@/store/operation/operationModel'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

interface ProcedureInfoProps {
    procedureInfo: OpdOperationModel[] | IpdOperationModel[]
}

const ProcedureInfo = (props: ProcedureInfoProps) => {
    // const [procedure, setProcedure] = useState<OpdOperationModel[]>([])

    // useEffect(() => {
    //     getProcedure(props.procedureInfo)
    // }, [props])

    // const getProcedure = (value: OpdOperationModel[]) => {
    //     setProcedure(value)
    // }

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
            <Table
                columns={column} dataSource={procedure}
                pagination={false}
                style={{ margin: -10, width: "99%" }}
                sticky
                scroll={{ x: 500 }}
            />
        </React.Fragment>
    )
}

export default ProcedureInfo