'use client'
import React, { useEffect, useState } from "react"
import Dashboard from "./dashboard.component"
import { DashboardModel } from "@/store/dashboard/dashboard.entity"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { getDashboardOpd, getDashboardIod, selectIpdDashboard, selectOpdDashboard, selectStatus } from "@/store/dashboard/dashboardSlice"

const DashboardPage = () => {
  const [opd, setOpd] = useState<DashboardModel[]>([])
  const [ipd, setIpd] = useState<DashboardModel[]>([])
  const getOpdDashboard = useAppSelector(selectOpdDashboard)
  const getIpdDashboard = useAppSelector(selectIpdDashboard)
  const dispatch = useAppDispatch()

  const getOpd = () => {
    setOpd(getOpdDashboard)
  }

  const getIpd = () => {
    setIpd(getIpdDashboard);
  }

  useEffect(() => {
    getOpd()
    getIpd()
  }, [getOpdDashboard, getIpdDashboard])


  useEffect(() => {
    dispatch(getDashboardOpd(null))
    dispatch(getDashboardIod(null))
  }, [])

  return (
    <React.Fragment>
      <Dashboard type="opd" dashboardList={opd} />
      <Dashboard type="ipd" dashboardList={ipd} />
    </React.Fragment>
  )
}

export default DashboardPage