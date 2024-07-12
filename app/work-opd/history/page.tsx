'use client'
import { Button, Col, DatePicker, Form} from 'antd'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { searchAsync, selectResult, selectStatus, } from '@/store/history/historyOpdSlice'
import ClaimHistory from './claim.history'
import withTheme from '@/theme'

const History = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const claimNumber = useAppSelector(selectResult)

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
      <Col span={24}>
        <ClaimHistory opdHistory={claimNumber} />
      </Col>
    </React.Fragment>
  )
}
const Historys = () => {
  return withTheme(<History />);
}
export default Historys