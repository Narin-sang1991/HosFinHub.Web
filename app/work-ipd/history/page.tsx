'use client'
import { Button, Col, DatePicker, Form, message, Row, Select, Space } from 'antd'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getIpdClaim, selectStatus } from '@/store/history/historyIpdSlice'
import ClaimHistory from './claim.history'
import { ClaimStatusModel, getClaimStatus, selectClaimStatus } from '@/store/claim-status/claimStatusSlice'
import { RequestHsitoryClaim } from '@/store/history/claimModel'

const History = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const claimStatus = useAppSelector(selectClaimStatus) as unknown as ClaimStatusModel[]

  useEffect(() => {
    dispatch(getClaimStatus(null))
  }, [])

  const onSearch = async (value: any) => {
    if (value.date === undefined || value.status_process === undefined) {
      message.warning("ระบุข้อมูลก่อน")
    } else {
      const setDateStart = (value.date[0].$d as Date).toLocaleDateString('en-CA')
      const setDateEnd = (value.date[1].$d as Date).toLocaleDateString('en-CA')
      const getStatus = value.status_process
      const criteria: RequestHsitoryClaim = {
        startDate: setDateStart,
        endDate: setDateEnd,
        statusProcess: getStatus,
        serviceType: 'ipd'
      }
      await dispatch(getIpdClaim(criteria))
    }
  }
  return (
    <React.Fragment>
      <Col lg={{ span: 24 }}>
        <Row gutter={[8, 8]}>
          <Col lg={{ span: 24 }}>
            <Form
              layout='inline'
              onFinish={onSearch}
            >
              <Space>
                <Form.Item name='date' rules={[{ required: true }]}>
                  <DatePicker.RangePicker />
                </Form.Item>

                <Form.Item name="status_process" style={{ width: "200px" }} rules={[{ required: true }]}>
                  <Select
                    placeholder="ระบุสถานะ"

                    options={claimStatus.map(item => {
                      const obj = {
                        label: item.fdh_status_process_th + "[" + item.fdh_status_process + "]",
                        value: item.fdh_status_process
                      }
                      return obj
                    })} />
                </Form.Item>

                <Form.Item>
                  <Button
                    htmlType='submit'
                    loading={status === "loading"}
                    disabled={status === "loading"}>
                    {"ค้นหา"}
                  </Button>
                </Form.Item>
              </Space>
            </Form>

          </Col>
          <Col lg={{ span: 24 }}>
            <ClaimHistory />
          </Col>
        </Row>
      </Col>
    </React.Fragment>
  )
}

export default History