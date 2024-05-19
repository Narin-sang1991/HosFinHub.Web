"use client";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { OpdSearchModel } from '@/store/work-opd/opdSearchModel'
import { selectResult, searchAsync, selectStatus } from '@/store/work-ipd/transferIpdSlice'
import { SearchOutlined, SendOutlined } from '@ant-design/icons'
import { Space, Button, DatePicker, Form, FormProps, message, Table, TableColumnsType } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { dateDisplayFormat, } from "@/client.constant/format.constant";
import { getPatientID } from "@/client.constant/patient.constant";
// import Fillter from '../search/filler';
import { claimIpd } from '@/services/send.fhd.prioviver';
import { IpdTransferMode } from '@/store/work-ipd/ipdTransderModel';

const IpdTransfer = () => {
  const dispatch = useAppDispatch();
  const [formDateFind] = Form.useForm();
  const [readyTable, setReadyTable] = useState<any[]>()
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [selectData, setSelectData] = useState<any[]>([])
  const status = useAppSelector(selectStatus);
  const selectResults = useAppSelector(selectResult)


  useEffect(() => { getReadyData() }, [selectResults])

  const getReadyData = () => {
    let valueReady: any[] = []
    
    selectResults.forEach(item => {
      if (item.ipd_claim_log.length > 0) {
      //  valueReady.push(item)
        const filterItem = item.ipd_claim_log.filter(i => i.status_code === "2")
        if (filterItem.length > 0) {
          valueReady.push(item)
          console.log(item);
        }
      }
    })

    console.log(valueReady);
    
    setReadyTable(valueReady)
  }

  function getPatientName(record: IpdTransferMode) {
    if (record.ipd_pat !== undefined) {
      let patient = record.ipd_pat;
      return `${patient.title}${patient.fname}  ${patient.lname}`;
    }
    return "";
  }

  function getRecordPatientID(record: IpdTransferMode) {
    if (record.ipd_pat !== undefined) {
      let patient = record.ipd_pat;
      return getPatientID(patient.person_id);
    }
    return "";
  }

  function getRecordPatientInscl(record: IpdTransferMode) {
    if (record.ipd_pat !== undefined) {

      if (record.ipd_pat.pat_ins === undefined) {
        return ""
      } else {
        const patientInscl = record.ipd_pat.pat_ins.find((i) => i.cid === record.ipd_pat.person_id)
        return patientInscl?.inscl;
      }
    } else {
      return "";
    }
  }

  const columns: TableColumnsType = [
    {
      title: "HN",
      dataIndex: "hn",
      key: "hn",
      width: 40,
      fixed: "left",
      ellipsis: true,
      sorter: (a, b) => a.hn.localeCompare(b.hn),

    },
    {
      title: "IPD ADMID",
      dataIndex: "dateopd",
      key: "dateopd",
      width: 60,
      ellipsis: true,
      render: (date) => {
        return moment(new Date(date)).format("YYYY") === "1970" ? (
          <></>
        ) : (
          moment(date).format(dateDisplayFormat)
        );
      },
    },
    {
      title: "Patient Name",
      key: "ipd_pat",
      width: 80,
      render: (record) => <>{getPatientName(record)}</>,
    },
    {
      title: "Person ID",
      key: "person_id",
      width: 80,
      render: (record) => <>{getRecordPatientID(record)}</>,
    },
    {
      title: "สิทธิ.",
      dataIndex: "inscl",
      key: "inscl",
      width: 40,
      ellipsis: true,
      render: (_: any, record: IpdTransferMode) => (
        <>{getRecordPatientInscl(record)}</>
      ),
    },
    {
      title: "AN.",
      dataIndex: "an",
      key: "an",
      width: 40,
      ellipsis: true,
      onFilter: (value, record) => record.error.map((item: any) => item.code_error).indexOf(value as string) === 0,
    },
    {
      title: "Status",
      dataIndex: "ipd_claim_log",
      key: 'seq',
      width: 40,
      ellipsis: true,
      render: (_: any, record: IpdTransferMode) => <div>{record.ipd_claim_log.map(i => i.status.description)[0]}</div>
    }
  ]

  const onSearchIpd: FormProps['onFinish'] = async (value) => {
    if (value.dateVisit === undefined) return
    const startDate = new Date(value.dateVisit[0].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" }).replaceAll('-', '')
    const endDate = new Date(value.dateVisit[1].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" }).replaceAll('-', '')
    await dispatch(searchAsync({ startDate, endDate }));
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: OpdSearchModel[]) => {
      //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows)
    },
    getCheckboxProps: (record: OpdSearchModel) => ({}),
  };

  const sentDataToFinance = async () => {
    const getAn = selectData?.map(item => item.an)
    if (getAn.length > 0) {
      const resultClaim = await claimIpd(getAn) as unknown as any
      if (resultClaim.status === 200) {
        message.success(resultClaim.message_th)
      } else {
        message.error(resultClaim.message_th)
      }
    } else {
      message.warning('เลือกรายการที่ต้องการส่ง')
    }

  }
  return (
    <React.Fragment>
      <Space direction='vertical'>
        <Form
          layout="inline"
          form={formDateFind}
          onFinish={onSearchIpd}
        >
          <Form.Item label='ระบุวันที่แอดมิด' name="dateVisit">
            <DatePicker.RangePicker />
          </Form.Item>

          <Form.Item name="load_data">
            <Button
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={status === "loading"}
              disabled={status === "loading"}
            >ค้นหา</Button>
          </Form.Item>

          <Form.Item style={{ left: '5%' }}>
            <Button type="primary" onClick={sentDataToFinance} icon={<SendOutlined />}>
              FDH
            </Button>
          </Form.Item>
        </Form>

        {/* <Fillter /> */}

        <Table
          rowSelection={{ type: selectionType, ...rowSelection }}
          columns={columns}
          dataSource={readyTable}
          pagination={false}
          rowKey={"seq"}
        />
      </Space>
    </React.Fragment>
  )
}

export default IpdTransfer

