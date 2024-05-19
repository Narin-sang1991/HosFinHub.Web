"use client";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { OpdSearchModel } from '@/store/work-opd/opdSearchModel'
import { searchTransferOpd, selectStatus, selectResultTransferOpd } from '@/store/work-opd/transferOpdSlice'
import { SearchOutlined, SendOutlined } from '@ant-design/icons'
import { Space, Button, DatePicker, Form, FormProps, message, Table, TableColumnsType } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { dateDisplayFormat, } from "@/client.constant/format.constant";
import { getPatientID } from "@/client.constant/patient.constant";
import Fillter from '../search/filler';
import { claimOpd } from '@/services/send.fhd.prioviver';

const OpdTransfer = () => {
  const dispatch = useAppDispatch();
  const [formDateFind] = Form.useForm();
  const searchTabletResult = useAppSelector(selectResultTransferOpd);
  const [readyTable, setReadyTable] = useState<any[]>()
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [selectData, setSelectData] = useState<any[]>([])
  const status = useAppSelector(selectStatus);

  useEffect(() => { getReadyData() }, [searchTabletResult])

  const getReadyData = () => {
    console.log(searchTabletResult);
    setReadyTable(searchTabletResult)
  }

  function getPatientName(record: OpdSearchModel) {
    if (record.opd_pat !== undefined) {
      let patient = record.opd_pat;
      return `${patient.title}${patient.fname}  ${patient.lname}`;
    }
    return "";
  }

  function getRecordPatientID(record: OpdSearchModel) {
    if (record.opd_pat !== undefined) {
      let patient = record.opd_pat;
      return getPatientID(patient.person_id);
    }
    return "";
  }

  function getRecordPatientInscl(record: OpdSearchModel) {
    if (record.opd_pat !== undefined) {

      if (record.opd_pat.pat_ins === undefined) {
        return ""
      } else {
        const patientInscl = record.opd_pat.pat_ins.find((i) => i.seq === record.seq)
        return patientInscl?.inscl;
      }
    } else {
      return "";
    }
  }

  const columns: TableColumnsType<OpdSearchModel> = [
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
      title: "OPD Date",
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
      key: "opd_pat",
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
      render: (_: any, record: OpdSearchModel) => (
        <>{getRecordPatientInscl(record)}</>
      ),
    },
    {
      title: "SEQ.",
      dataIndex: "seq",
      key: "seq",
      width: 40,
      ellipsis: true,
      onFilter: (value, record) => record.error.map((item) => item.code_error).indexOf(value as string) === 0,
    },
    {
      title: "Status",
      dataIndex: "opd_claim_log",
      key: 'seq',
      width: 40,
      ellipsis: true,
      render: (_: any, record: OpdSearchModel) => <div>{record.opd_claim_log.map(i => i.status.description)[0]}</div>
    }
  ]

  const onSearchOpd: FormProps['onFinish'] = async (value) => {
    if (value.dateVisit === undefined) return
    const startDate = new Date(value.dateVisit[0].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" }).replaceAll('-', '')
    const endDate = new Date(value.dateVisit[1].$d).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: "2-digit" }).replaceAll('-', '')
    await dispatch(searchTransferOpd({ startDate, endDate }));
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: OpdSearchModel[]) => {
      //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectData(selectedRows)
    },
    getCheckboxProps: (record: OpdSearchModel) => ({}),
  };

  const sentDataToFinance = async () => {
    const getSeq = selectData?.map(item => item.seq)
    if (getSeq.length > 0) {
      const resultClaim = await claimOpd(getSeq) as unknown as any
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
          onFinish={onSearchOpd}
        >
          <Form.Item label='ระบุวันที่รับบริการ' name="dateVisit">
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
          size='small'
          loading={status === "loading"}

        />
      </Space>
    </React.Fragment>
  )
}

export default OpdTransfer

