import React from "react"
import Dashboard, { DashboardModel } from "../dashboard-sub-component/dashboard.component"

const DashboardPage = () => {

  const dataOpd:DashboardModel={
    data:{
      title:'OPD',
      fdn:10,
      approved:20,
      cut_off_batch:0,
      received:102,
      rejected:5,
      settled:3
    }
  }
  const dataIpd:DashboardModel={
    data:{
      title:'IPD',
      fdn:1,
      approved:220,
      cut_off_batch:10,
      received:14,
      rejected:50,
      settled:13
    }
  }
  return (
    <React.Fragment>
      <Dashboard data={dataOpd.data} />
      <Dashboard data={dataIpd.data} />
    </React.Fragment>
  )
}

export default DashboardPage