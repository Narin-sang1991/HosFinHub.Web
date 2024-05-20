import { Table } from "antd"
import React, { useEffect, useState } from "react"
import { OdxModel } from '@/store/financial/opdModel'
interface DiagenosisInfoProps {
    diagenosisInfo: OdxModel[]
}

const DiagenosisInfo = (props: DiagenosisInfoProps) => {
    const [diage, setDiages] = useState<OdxModel[]>([])

    const getDiage = (value: OdxModel[]) => {
        setDiages(value)
    }

    useEffect(() => {
        getDiage(props.diagenosisInfo)
    }, [props])

    const column = [
        {
            key: 'datedx',
            title: 'วันที่บันทึก',
            dataIndex: 'datedx'
        },
        {
            key: 'dxtype',
            title: 'ลำดับการวินิฉัย',
            dataIndex: 'dxtype'
        },
        {
            key: 'diag',
            title: 'ICD10',
            dataIndex: 'diag'
        },
        {
            key: 'drdx',
            title: 'Doctor Code',
            dataIndex: 'drdx'
        },
        {
            key: 'clinic',
            title: 'Clinic Code',
            dataIndex: 'clinic'
        },
    ]
    return (
        <React.Fragment>
            <Table columns={column}
                dataSource={diage}
                pagination={false}
                style={{ margin: -10, width: "99%" }}
                sticky
                scroll={{ x: 500 }}
            />
        </React.Fragment>
    )
}

export default DiagenosisInfo