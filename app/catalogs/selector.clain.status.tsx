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