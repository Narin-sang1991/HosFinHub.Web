'use client'

import { OpdClamHistory, OpdClamService } from "@/store/history/claimModel";
import { Badge, Card, Col, Row, Tag, Tooltip, Table } from "antd";
import type { TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getOpdClaim, selectClaimService, selectStatus } from "@/store/history/historyOpdSlice";


interface ClaimHistoryProps {
  opdHistory: OpdClamHistory[]
}

interface ClaimServiceType {
  hn: string,
  vn: string,
  patien: string,
  inscl: string,
  moneyClaim: string
  moneyNotClaim: string
  fdh: any[]
}

const ClaimHistory = (props: ClaimHistoryProps) => {
  const dispatch = useAppDispatch()
  const claimService = useAppSelector(selectClaimService)
  const claimStatus = useAppSelector(selectStatus)
  const [dataClaimService, setDataClaimService] = useState<ClaimServiceType[]>([])

  useEffect(() => {
    setColumnDataClaimService(claimService)
  }, [claimService])

  const setColumnDataClaimService = (claimService: OpdClamService[]) => {
    const ListObjClaim: ClaimServiceType[] = []
    if (claimService.length > 0) {
      claimService.forEach(item => {

        const claimTotal = item.cht.reduce((pre, cur) => +(cur.total) + +(pre), 0).toString()
        const paid = item.cht.reduce((pre, cur) => +(cur.paid) + +(pre), 0).toString()
        const setObjClaim: ClaimServiceType = {
          hn: item.hn,
          vn: item.seq,
          patien: item.pat[0]?.namepat,
          inscl: item.ins[0]?.inscl,
          moneyClaim: claimTotal,
          moneyNotClaim: paid,
          fdh: item.fdh
        }

        ListObjClaim.push(setObjClaim)
      })
    }

    setDataClaimService(ListObjClaim)
  }

  const onSelectRow = async (record: any) => {
    const getSeq = { 'seq': record.service.map((i: any) => i.seq) }
    await dispatch(getOpdClaim(getSeq))
  }

  const columnClaimNumber = [
    {
      title: 'HOS CALIM',
      key: 'opd_claim_number',
      dataIndex: 'opd_claim_number',
      render: (row: any, record: OpdClamHistory) => (<a onClick={() => onSelectRow(record)}>{row}</a>)
    }, {
      title: 'จำนวน',
      key: 'service',
      dataIndex: 'service',
      render: (_: any, rec: any) => (<>{_.length}</>)

    }, {
      title: 'วันที่ส่งเคลม',
      key: 'sent_date',
      dataIndex: 'sent_date',
      render: (value: string) => {
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

  const columnClaimOpdList = [
    {
      title: 'HN',
      key: 'hn',
      dataIndex: 'hn',
    }, {
      title: 'VN',
      key: 'vn',
      dataIndex: 'vn',
    }, {
      title: 'ชื่อ-สกุล',
      key: 'patien',
      dataIndex: 'patien',
    }, {
      title: 'สิทธิ์',
      key: 'inscl',
      dataIndex: 'inscl',
    }, {
      title: 'เบิกได้',
      key: 'moneyClaim',
      dataIndex: 'moneyClaim',
    },
    {
      title: 'เบิกไม่ได้',
      key: 'moneyNotClaim',
      dataIndex: 'moneyNotClaim',
    },
    {
      title: 'สถานะ',
      key: 'fdh',
      dataIndex: 'fdh',
      render: (fdh: any[]) => {
        const list = fdh?.slice(-1).pop()
        let color = ''
        if (list?.process_status === "0") {
          color = 'processing'
        } else if (list?.process_status === "1") {
          color = 'processing'
        } else if (list?.process_status === "2") {
          color = 'warning'
        } else if (list?.process_status === "3") {
          color = 'lime'
        } else if (list?.process_status === "4") {
          color = 'success'
        } else if (list?.process_status === "5") {
          color = 'lime'
        } else if (list?.process_status === "6") {
          color = 'success'
        }
        else {
          color = 'error'
        }
        return <Tooltip title={list.reject_list !== undefined ? list.reject_list.slice(-1).pop().description : 'success'}>
          <Badge count={fdh.length}>
            <Tag color={color}>{list === undefined ? 'ไม่พบข้อมูล' : list.status_message_th}</Tag>
          </Badge>
        </Tooltip>
      }
    }
  ]

  return (
    <React.Fragment>
      <Row gutter={[8, 8]}>
        <Col sm={{ span: 24 }} xl={{ span: 8 }}>
          <Card size="small">
            <Table
              columns={columnClaimNumber}
              size='small'
              dataSource={props.opdHistory}
              rowKey={'opd_claim_number'}
              // rowHoverable={true}
            />
          </Card>
        </Col>
        <Col sm={{ span: 24 }} xl={{ span: 16 }}>
          <Card size="small">
            <Table
              size='small'
              columns={columnClaimOpdList}
              dataSource={dataClaimService}
              pagination={false}
              loading={claimStatus === 'loading' ? true : false}
            />
          </Card>
        </Col>
      </Row>

    </React.Fragment>
  )
}

export default ClaimHistory