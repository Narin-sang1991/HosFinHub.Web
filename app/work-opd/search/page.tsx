"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Table, DatePicker, Tag, message, Badge, Space, Select, } from "antd";
import type { TableProps, TableColumnsType, } from "antd";
import { SearchOutlined, EditOutlined, SendOutlined, } from "@ant-design/icons";
import moment from "moment";
import withTheme from "../../../theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getResult, saveAsync, searchAsync, getAsync, selectStatus, selectTabletResult } from "@/store/work-opd/workOpdSlice";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import { getPatientID } from "@/client.constant/patient.constant";
import { dateDisplayFormat, dateInterfaceFormat, } from "@/client.constant/format.constant";
import "@/app/globals.css";
import { claimOpd } from "@/services/send.fhd.prioviver";
import ButtonSent from "./button.send";
import Fillter from "./filler";
import { selectUccOption } from "@/store/insure/insureOpdSlice";

// moment.locale('th');
type OpdSearchProps = {};
type FilterType = { text: string; value: string };

const OpdSearch = function OpdSearch(props: OpdSearchProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formCriteria] = Form.useForm();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(15);
  const [filterValue, setFilterValue] = useState<FilterType[]>([]);
  const status = useAppSelector(selectStatus);
  const selectUccOptions = useAppSelector(selectUccOption);
  const searchTabletResult = useAppSelector(selectTabletResult);
  const originData = useAppSelector(getResult);
  const [uuc, setUuc] = useState<string>("1")
  //claim  FDH
  const onClickClaim = async (seq: string, countSend: number) => {
    const resultClaim = await claimOpd([seq]) as unknown as any
    if (resultClaim.status === 200) {
      message.success(resultClaim.message_th)
    } else {
      message.error(resultClaim.message_th)
    }
  }
  // set errorfilter
  const setFilterError = (searchTabletResult: OpdSearchModel[]) => {
    const fillter: FilterType[] = [];
    searchTabletResult.forEach((pat) => {
      if (pat.error.length > 0) {
        pat.error.map((e) => {
          const index = fillter.findIndex((f) => f.text === e.code_error);
          if (index === -1) {
            const filler: FilterType = {
              text: e.code_error,
              value: e.code_error,
            };
            fillter.push(filler);
          }
        });
      }
    });
    setFilterValue(fillter);
  };

  useEffect(() => {
    setFilterError(searchTabletResult);
  }, [searchTabletResult]);

  
  //#region Search
  async function onSearch(index?: number, sorter?: any) {
    // console.log("page-searchAsync-->");
    formCriteria.validateFields().then((values: any) => {
      setPageIndex(index ?? 1);
      (async () => {
        let criteria = packCriteria(index ?? 1, sorter, values);
        await dispatch(searchAsync(criteria));
      })();
    });
  }

  function packCriteria(index: number, sorter?: any, values: any) {
    return {
      startDate: moment(new Date(values.DateFrom)).format(dateInterfaceFormat),
      endDate: moment(new Date(values.DateTo)).format(dateInterfaceFormat),
    };
  }
  //#endregion

  //#region Local Filter Data
  const onTableCriteriaChange: TableProps<OpdSearchModel>["onChange"] = (pagination, filters, sorter, extra) => {
    // onSearch(pagination.current, sorter);
    setPageIndex(pagination.current || 1);
  };

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


  const onChangeOpdUuc = async (value: string, record: OpdSearchModel) => {
    console.log(value);

    setUuc(value)
    dispatch(getAsync({ seq: record.seq }))
  }

  const updateUuc = async () => {
    console.log("effect orgindata");
    console.log(uuc);

    if (originData === undefined) return

    const newOpd = originData?.opd.map((itemOpd) => {
      const newItemOpd = { ...itemOpd }
      newItemOpd.uuc = uuc
      return newItemOpd;
    });

    const updatedOriginData = { ...originData, opd: newOpd };
    console.log(updatedOriginData);

    await dispatch(saveAsync({ ...updatedOriginData }));
  }
  useEffect(() => {
    updateUuc()
  }, [originData])

  const columns: TableColumnsType<OpdSearchModel> = [
    {
      title: "Calim",
      dataIndex: "seq",
      key: "seq",
      fixed: 'left',
      width: 50,
      render: (seq, record: OpdSearchModel) =>
        <Badge count={record.opd_claim_log.length} color="green">
          <Button onClick={() => onClickClaim(seq, record.opd_claim_log.length)} icon={<SendOutlined />}>ส่งข้อมูลFDH</Button>
        </Badge>
    },
    {
      title: "เบิก",
      dataIndex: "uuc",
      key: "uuc",
      width: 50,
      fixed: "left",
      ellipsis: true,
      render: (_value, record: OpdSearchModel) => (
        <Select
          onChange={(valueNumber) => onChangeOpdUuc(valueNumber, record)}
          options={selectUccOptions}
          defaultValue={_value}
 
        />
      )
    },
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
      title: "Error",
      dataIndex: "error",
      key: "error",
      width: 40,
      ellipsis: true,
      filterSearch: true,
      filters: filterValue,
      onFilter: (value, record) =>
        record.error.map((item) => item.code_error).indexOf(value as string) ===
        0,
      render: (value: any[], _: OpdSearchModel) => {
        if (value.length > 0) {
          return value.map((item) => {
            return <Tag color="volcano">{item.code_error}</Tag>;
          });
        } else {
          return "";
        }
      },
    },
    {
      title: null,
      key: "action",
      width: 20,
      fixed: "right",
      render: (_: any, record: OpdSearchModel) => (
        <Button
          type="primary"
          ghost
          block
          style={{ border: 0 }}
          icon={<EditOutlined />}
          onClick={() => router.push(`/work-opd/editor?id=${record.seq}`)}
        />
      ),
    },
  ];
  //#endregion

  return (
    <Space direction="vertical">
      <Card
        bordered={true}
        style={{ borderBottomColor: "LightGray" }}
        className={"MasterBackground"}
      >
        <Form
          layout="inline"
          name="criteriaFormSearch"
          form={formCriteria}
          onFinish={() => onSearch(1)}
        >
          <Form.Item
            label="OPD Date From: "
            name="DateFrom"
            rules={[{ required: true }]}
          >
            <DatePicker placeholder="Select Date" allowClear />
          </Form.Item>
          <Form.Item label="To: " name="DateTo" rules={[{ required: true }]}>
            <DatePicker placeholder="Select Date" allowClear />
          </Form.Item>
          <Form.Item label="" name="load_data">
            <Button
              key="load_data"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={status === "loading"}
              disabled={status === "loading"}
              onClick={() => onSearch(1)}
            >
              {"ค้นหา"}
            </Button>
          </Form.Item>
          <Form.Item label="" name="send_data">
            <ButtonSent opd={searchTabletResult} />
          </Form.Item>
        </Form>
      </Card>

      <Fillter />

      <Table
        rowKey={(record) => record.id}
        loading={status === "loading"}
        columns={columns}
        dataSource={searchTabletResult || []}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: searchTabletResult?.length || 10,
          showSizeChanger: true,
        }}
        onChange={onTableCriteriaChange}
        size="small"
        className={"MasterBackground"}
        style={{ margin: "10px 0", width: "100%" }}
        sticky
        scroll={{ x: 1000 }}
      />
    </Space>
  );
};

const OpdSearchPage = () => {
  return withTheme(<OpdSearch />);
};

export default OpdSearchPage;
