'use client'
import { Button, Col, DatePicker, Form, Row, Table } from 'antd'
import React from 'react'
import { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { searchAsync, selectStatus, selectResult } from '@/store/history/historyOpdSlice'

const Page = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const claimNumber = useAppSelector(selectResult)
  const column: ColumnsType = [
    {
      title: 'HOS CALIM',
      key: 'opd_claim_number',
      dataIndex: 'opd_claim_number',

    }, {
      title: 'จำนวน',
      key: 'service',
      dataIndex: 'service',
      render: (_: any, rec: any) => (<>{_.length}</>)

    }, {
      title: 'วันที่ส่งเคลม',
      key: 'sent_date',
      dataIndex: 'sent_date',
      render: (value, date) => {
        const newDate = new Date((value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2))).toLocaleDateString('th-TH')

        return (
          <>{newDate}</>
        )
      }

    }, {
      title: 'ผู้ส่ง',
      key: 'staff_number_claim',
      dataIndex: 'staff_number_claim',
    }
  ]

  const onSearch = async (value: any) => {
    if (value.date === undefined) return
    const setDateStart = (value.date[0].$d as Date).toLocaleDateString('en-CA')
    const setDateEnd = (value.date[1].$d as Date).toLocaleDateString('en-CA')
    const criteria = {
      startDate: setDateStart,
      endDate: setDateEnd
    }
    await dispatch(searchAsync(criteria))

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
          <Button htmlType='submit'
            loading={status === "loading"}
            disabled={status === "loading"}>ค้นหา</Button>
        </Form.Item>
      </Form>
      <Col lg={{ span: 24 }}>
      <Row gutter={[8, 8]}>
     
          <Col lg={{ span: 4 }}>
            <Table columns={column} dataSource={claimNumber} bordered />
          </Col>
          <Col lg={{ span: 6 }}><Table /></Col>
          <Col lg={{ span: 6 }}><Table /></Col>
     

      </Row>
      </Col>
    </React.Fragment>
  )
}

export default Page