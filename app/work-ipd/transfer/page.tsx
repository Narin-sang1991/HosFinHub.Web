"use client";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectIpdTransferReady, searchAsync, selectStatus } from '@/store/work-ipd/transferIpdSlice'
import { SearchOutlined, SendOutlined } from '@ant-design/icons'
import { Space, Button, DatePicker, Form, FormProps, message, Table } from 'antd';
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { dateDisplayFormat, } from "@/client.constant/format.constant";
import { getPatientID } from "@/client.constant/patient.constant";
import { claimIpd } from '@/services/send.fhd.prioviver';
import { IpdPat, IpdTransferMode } from '@/store/work-ipd/ipdTransderModel';
import type { TableColumnsType } from "antd";

const IpdTransfer = () => {
  const dispatch = useAppDispatch();
  const [formDateFind] = Form.useForm();
  const [readyTable, setReadyTable] = useState<any[]>()
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [selectData, setSelectData] = useState<any[]>([])
  const status = useAppSelector(selectStatus);
  const ipdTransferReady = useAppSelector(selectIpdTransferReady)

  useEffect(() => {
    getReadyData()
  }, [ipdTransferReady])

  const getReadyData = () => {
    setReadyTable(ipdTransferReady)
  }

  function getPatientName(record: IpdTransferMode) {
    if (record?.work_pat !== undefined) {
      let patient = record.work_pat;
      return `${patient.title}${patient.fname}  ${patient.lname}`;
    }
    return "";
  }

  function getRecordPatientID(record: IpdTransferMode) {
    if (record?.work_pat !== undefined) {
      let patient = record.work_pat;
      return getPatientID(patient.person_id);
    }
    return "";
  }

  function getRecordPatientInscl(record: IpdPat): string | undefined {

    if (record?.pat_ins !== undefined) {
      if (record.pat_ins === undefined) {
        return ""
      } else {
        const patientInscl = record.pat_ins.find((i) => i.an === record.pat_ins[0].an)
        return patientInscl?.inscl
      }
    } else {
      return "";
    }
  }

  const columns: TableColumnsType<any> = [
    {
      title: "HN",
      dataIndex: "hn",
      key: "hn",
      width: 40,
      fixed: "left",
      ellipsis: true,
      sorter: (a: any, b: any) => a.hn.localeCompare(b.hn),
    },
    {
      title: "วันที่จำหน่าย",
      dataIndex: "datedsc",
      key: "datedsc",
      width: 60,
      ellipsis: true,
      render: (date: string) => {
        return moment(new Date(date)).format("YYYY") === "1970" ? (
          <></>
        ) : (
          moment(date).format(dateDisplayFormat)
        );
      },
    },
    {
      title: "Patient Name",
      key: "work_pat",
      width: 80,
      render: (record: IpdTransferMode) => <>{getPatientName(record)}</>,
    },
    {
      title: "Person ID",
      key: "person_id",
      width: 80,
      render: (record: IpdTransferMode) => <>{getRecordPatientID(record)}</>,
    },
    {
      title: "สิทธิ.",
      dataIndex: "work_pat",
      key: "work_pat",
      width: 40,
      ellipsis: true,
      render: (record: IpdPat) => <>{getRecordPatientInscl(record)}</>
    },
    {
      title: "AN.",
      dataIndex: "an",
      key: "an",
      width: 40,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "ipd_claim_log",
      key: 'ipd_claim_log',
      width: 40,
      ellipsis: true,
      render: (record: IpdTransferMode) => <div>{record?.claim_log.map(i => i.status.description)[0]}</div>
    }
  ]

  const onSearchIpd: FormProps['onFinish'] = async (value) => {
    if (value.dateVisit === undefined) return
    const startDate = new Date(value.dateVisit[0].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" }).replaceAll('-', '')
    const endDate = new Date(value.dateVisit[1].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" }).replaceAll('-', '')
    await dispatch(searchAsync({ startDate, endDate }));
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IpdTransferMode[]) => {
      //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows)
    },
    getCheckboxProps: (record: IpdTransferMode) => ({}),
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
          size='small'
          rowKey={"an"}
          loading={status === "loading"}
        />
      </Space>
    </React.Fragment>
  )
}

// const IpdTransfers = () => {
//   return withTheme(<IpdTransfer />);
// };
export default IpdTransfer

