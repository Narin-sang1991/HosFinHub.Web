/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Select } from "antd"
import React, { useEffect, useState } from "react"
import { getClaimStatus, selectClaimStatus } from "@/store/claim-status/claimStatusSlice"
import { useAppSelector, useAppDispatch } from "@/store/hooks";

const ClaimStatusTypeSelector = () => {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectClaimStatus);
  const [itemOptions, setItemOptions] = useState<{ 'value': string, 'label': string }[]>([])

  useEffect(() => {
    dispatch(getClaimStatus({}))
    setItem()
  }, [])

  const setItem = () => {
    const getStats = status.claimStatus.map(i => {
      const obj = { value: i.fdh_status_process, label: i.fdh_status_process_th }
      return obj
    })
    console.log();

    setItemOptions(getStats)

  }
  return (
    <React.Fragment>
      <Select
        allowClear
        placeholder="สถานะเคลม"
        style={{ width: '100%' }}
        options={itemOptions} />
    </React.Fragment>
  )
}

export default ClaimStatusTypeSelector