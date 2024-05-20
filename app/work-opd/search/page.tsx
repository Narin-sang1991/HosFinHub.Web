"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Table, DatePicker, Space, } from "antd";
import type { TableProps, TableColumnsType, } from "antd";
import { SearchOutlined, EditOutlined, } from "@ant-design/icons";
import moment from "moment";
import withTheme from "../../../theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getResult, searchAsync, selectResult, selectStatus, selectTabletResult } from "@/store/work-opd/workOpdSlice";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import { dateDisplayFormat, dateInterfaceFormat, defaultPageSize, } from "@/client.constant/format.constant";
import { prefixColumns, suffixColumns, uniqueFilter } from "@/client.constant/work.search.constant";
import Fillter from "./filler";
import "@/app/globals.css";

// moment.locale('th');
type OpdSearchProps = {};
type FilterType = { text: string; value: string };

const OpdSearch = function OpdSearch(props: OpdSearchProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formCriteria] = Form.useForm();
  const [pageCriteria, setPageCriteria] = useState({ pageIndex: 1, pageSize: defaultPageSize });
  // const [pageIndex, setPageIndex] = useState(1);
  // const [pageSize, setPageSize] = useState(defaultPageSize);
  const [filterValue, setFilterValue] = useState<FilterType[]>([]);
  const status = useAppSelector(selectStatus);
  const searchTabletResult = useAppSelector(selectTabletResult);
  const searchResult = useAppSelector(selectResult);
  const originData = useAppSelector(getResult);
  const firstLoad = useRef(true)

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

  useEffect(() => {
    if (firstLoad.current === true) {
      firstLoad.current = false;
      return;
    }
    onSearch();
  }, [pageCriteria]);


  //#region Search
  async function onSearch() {
    formCriteria.validateFields().then((values: any) => {
      (async () => {
        let criteria = packCriteria(values);
        await dispatch(searchAsync(criteria));
      })();
    });
  }

  function packCriteria(values: any) {
    return {
      startDate: moment(new Date(values.DateFrom)).format(dateInterfaceFormat),
      endDate: moment(new Date(values.DateTo)).format(dateInterfaceFormat),
      pageIndex: pageCriteria.pageIndex - 1,
      pageSize: pageCriteria.pageSize,
    };
  }
  //#endregion

  //#region Local Filter Data
  const onTableCriteriaChange: TableProps<OpdSearchModel>["onChange"] = (pagination, filters, sorter, extra) => {
    if (firstLoad.current === true) {
      firstLoad.current = false;
      return;
    }
    setPageCriteria({
      pageIndex: pagination.current || 1,
      pageSize: pagination.pageSize || defaultPageSize,
    });
  };

  const columns: TableColumnsType<OpdSearchModel> = [
    {
      title: <p className="Center">เลขที่ seq.</p>,
      dataIndex: "seq",
      key: "seq",
      width: 50,
      className: "Center",
      fixed: "left",
      onFilter: (value, record) => record.error.map((item) => item.code_error).indexOf(value as string) === 0,
    },
    {
      title: <p className="Center">วันที่รับบริการ</p>,
      dataIndex: "dateopd",
      key: "dateopd",
      width: 50,
      className: "Center",
      fixed: "left",
      render: (date) => {
        return moment(new Date(date)).format("YYYY") === "1970" ? (
          <></>
        ) : (
          moment(date).format(dateDisplayFormat)
        );
      },
    },
    ...prefixColumns,
    ...suffixColumns,
    // {
    //   title: <p className="Center">Error</p>,
    //   dataIndex: "error",
    //   key: "error",
    //   width: 40,
    //   className: "Center",
    //   filterSearch: true,
    //   filters: filterValue,
    //   onFilter: (value, record) =>
    //     record.error.map((item) => item.code_error).indexOf(value as string) ===
    //     0,
    //   render: (value: any[], _: OpdSearchModel) => {
    //     if (value.length > 0) {
    //       return value.map(t =>{return t.code_error} )
    //       .filter(uniqueFilter)
    //       .map((item) => {
    //         return <Tag color="volcano">{item}</Tag>;
    //       });
    //     } else {
    //       return "";
    //     }
    //   },
    // },
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
          onFinish={() => setPageCriteria({ pageIndex: 1, pageSize: pageCriteria.pageSize })}
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
              onClick={() => setPageCriteria({ pageIndex: 1, pageSize: pageCriteria.pageSize })}
            >
              {"ค้นหา"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Fillter />
      <Table
        rowKey={(record) => record.seq}
        loading={status === "loading"}
        columns={columns}
        dataSource={searchTabletResult || []}
        pagination={{
          current: pageCriteria.pageIndex,
          pageSize: pageCriteria.pageSize,
          total: searchResult?.rowCount || defaultPageSize,
          showSizeChanger: true,
        }}
        onChange={onTableCriteriaChange}
        size="small"
        className={"MasterBackground"}
        style={{ margin: 0, width: "100%" }}
        scroll={{ x: 650, y: 485 }}
      />
    </Space>
  );
};

const OpdSearchPage = () => {
  return withTheme(<OpdSearch />);
};

export default OpdSearchPage;
