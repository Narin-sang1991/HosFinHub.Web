"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Table, DatePicker, Tag, Flex, Segmented, message, } from "antd";
import type { TableProps, TableColumnsType } from "antd";
import { SearchOutlined, EditOutlined, SendOutlined, } from "@ant-design/icons";
import moment from "moment";
import withTheme from "../../../theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchAsync, selectResult, selectStatus, } from "@/store/work-opd/workOpdSlice";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import { getPatientID } from "@/client.constant/patient.constant";
import { dateDisplayFormat, dateInterfaceFormat, } from "@/client.constant/format.constant";
import "@/app/globals.css";
import { claimOpd } from "@/services/send.fhd.prioviver";
import ButtonSent from "./button.send";

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
  const searchResult = useAppSelector(selectResult);

  //claim  FDH
  const onClickClaim = async (seq: string) => {
    console.log(seq);
    const resultClaim = await claimOpd([seq]) as unknown as any

    if (resultClaim.status === 200) {
      message.success(resultClaim.message_th)
    } else {
      message.error(resultClaim.message_th)
    }
  }
  // set errorfilter
  const setFilter = (searchResult: OpdSearchModel[]) => {
    const fillter: FilterType[] = [];
    searchResult.forEach((pat) => {
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
    setFilter(searchResult);
  }, [searchResult]);
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

  const columns: TableColumnsType<OpdSearchModel> = [
    {
      title: "Calim",
      dataIndex: "seq",
      key: "seq",
      fixed: 'left', width: 60,
      render: (record) => <Button onClick={() => onClickClaim(record)} icon={<SendOutlined />}>ส่งข้อมูลFDH</Button>
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
    <>
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
              {"Load Data"}
            </Button>
          </Form.Item>
          <Form.Item label="" name="send_data">
            <ButtonSent opd={searchResult} />
          </Form.Item>
        </Form>
      </Card>
      <Table
        rowKey={(record) => record.id}
        loading={status === "loading"}
        columns={columns}
        dataSource={searchResult || []}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: searchResult?.length || 10,
          showSizeChanger: true,
        }}
        onChange={onTableCriteriaChange}
        size="small"
        className={"MasterBackground"}
        style={{ margin: "10px 0", width: "100%" }}
        sticky
        scroll={{ x: 1000 }}
      />
    </>
  );
};

const OpdSearchPage = () => {
  return withTheme(<OpdSearch />);
};
export default OpdSearchPage;
