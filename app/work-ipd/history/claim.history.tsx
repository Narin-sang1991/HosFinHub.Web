'use client'

import { HistoryClaimsIpdModel } from "@/store/history/claimModel";
import { Tag, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useAppSelector } from '@/store/hooks'
import dayjs from "dayjs";
import Link from "next/link";
import { ClaimItemsModel } from "./history.entity";
import { selectIpdHistoryClaims, selectStatus } from "@/store/history/historyIpdSlice";

const ClaimHistory = () => {
  const claimHistory = useAppSelector(selectIpdHistoryClaims)
  const claimStatus = useAppSelector(selectStatus)
  const [dataClaimService, setDataClaimService] = useState<ClaimItemsModel[]>([])

  useEffect(() => {
    setColumnDataClaimService(claimHistory)
  }, [claimHistory])

  const setColumnDataClaimService = (claimService: HistoryClaimsIpdModel[]) => {
    const setDataClaimSerivce: ClaimItemsModel[] = claimService.map(item => {
      const dataSourceData = {
        hn: item.hn,
        vn: item.an,
        patien: `${item.title} ${item.fname} ${item.lname}`,
        inscl: item.inscl,
        fdh_status_message_th: item.fdh_status_message_th,
        fdh_status_message: item.fdh_status_message,
        fdh_process_status: item.fdh_process_status,
        datedsc: dayjs(item.dateopd).format('DD/MM/YYYY')
      }

      return dataSourceData
    })

    setDataClaimService(setDataClaimSerivce)
  }


  const onSearchSeq = (item: ClaimItemsModel) => {
    if (item.vn == undefined || item.vn == "") return;

    let setLink = (color: string, vn?: string) => {
      if (vn !== undefined) {
        return (
          <Link href={{ pathname: `editor`, query: { id: vn } }} legacyBehavior replace>
            <a target="_blank"> <Tag color={color}>{item.fdh_status_message_th}</Tag></a>
          </Link>)
      } else {
        return <Tag color={color}>{item.fdh_status_message_th}</Tag>
      }
    }

    switch (item.fdh_process_status) {
      case '1':
        return setLink('processing')
      case '2':
        return setLink('processing')
      case '3':
        return setLink('error', item.vn)
      case '4':
        return setLink('processing')
      case '5':
        return setLink('success')
      case '6':
        return setLink('success')
      default:
        return setLink('')
    }
  }

  const columnClaimOpdfdh = [
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
      title: 'วันที่จำหน่าย',
      key: 'datedsc',
      dataIndex: 'datedsc',
    }, {
      title: 'สถานะ',
      key: 'vn',
      dataIndex: 'vn',
      render: (_: any, fdh: any) => onSearchSeq(fdh)
    }
  ]

  return (
    <React.Fragment>
      <Table size="small" bordered columns={columnClaimOpdfdh} dataSource={dataClaimService} rowKey={item => item.vn} />
    </React.Fragment>
  )
}

export default ClaimHistory