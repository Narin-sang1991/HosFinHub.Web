'use client'
import { Button, DatePicker, Form, Table } from 'antd'
import React from 'react'
import { HistoryColumn } from './history.column.entity'
import { ColumnsType } from 'antd/es/table'

const Page = () => {

    const column: ColumnsType = [
        {
            key: 'opd_claim_number',
            dataIndex: 'opd_claim_number',
            title: 'HOSPITAL CALIM'
        }, {
            key: 'sent_date',
            dataIndex: 'sent_date',
            title: 'วันที่ส่งเคลม'
        }, {
            key: 'บริการ',
            dataIndex: 'string',
            title: 'บริการ'
        }
    ]

    const onSearch = (value: any) => {
        if (value.date === undefined) return
        const setDateStart = (value.date[0].$d as Date).toLocaleDateString('en-CA')
        const setDateEnd = (value.date[1].$d as Date).toLocaleDateString('en-CA')
    }

    return (
        <React.Fragment>
            <Form
                layout='inline'
                onFinish={onSearch}
            >
                <Form.Item name='date'>
                    <DatePicker.RangePicker />
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit'>ค้นหา</Button>
                </Form.Item>
            </Form>

            <Table columns={column} />
        </React.Fragment>
    )
}

export default Page