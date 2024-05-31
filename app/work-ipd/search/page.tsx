"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Table, DatePicker, Space, } from "antd";
import type { TableProps, TableColumnsType, } from "antd";
import { SearchOutlined, EditOutlined, } from "@ant-design/icons";
import moment from "moment";
import withTheme from "../../../theme";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchAsync, selectResult, selectStatus } from "@/store/work-ipd/workIpdSlice";
import type { IpdSearchModel } from "@/store/work-ipd/ipdSearchModel";
import { dateDisplayFormat, dateInterfaceFormat, defaultPageSize } from "@/client.constant/format.constant";
import { prefixColumns, suffixColumns } from "@/client.constant/work.search.constant";
import "@/app/globals.css";

// moment.locale('th');
type IpdSearchProps = {};

const IpdSearch = function IpdSearch(props: IpdSearchProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formCriteria] = Form.useForm();
  const [pageCriteria, setPageCriteria] = useState({ pageIndex: 1, pageSize: defaultPageSize });
  const status = useAppSelector(selectStatus);
  const searchResult = useAppSelector(selectResult);
  const firstLoad = useRef(true)

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
  const onTableCriteriaChange: TableProps<IpdSearchModel>["onChange"] = (pagination, filters, sorter, extra) => {
    if (firstLoad.current === true) {
      firstLoad.current = false;
      return;
    }
    setPageCriteria({
      pageIndex: pagination.current || 1,
      pageSize: pagination.pageSize || defaultPageSize,
    });
  };

  const columns: TableColumnsType<IpdSearchModel> = [
    {
      title: <p className="Center">เลขที่ Admit</p>,
      dataIndex: "an",
      key: "an",
      width: 50,
      className: "Center",
      fixed: "left",
    },
    {
      title: <p className="Center">วันที่เข้า Admit</p>,
      dataIndex: "dateipd",
      key: "dateipd",
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
    {
      title: null,
      key: "action",
      width: 50,
      fixed: "right",
      render: (_: any, record: IpdSearchModel) => (
        <Button
          type="primary"
          ghost
          block
          style={{ border: 0 }}
          icon={<EditOutlined />}
          onClick={() => router.push(`/work-ipd/editor?id=${record.an}`)}
        />
      ),
    },
  ];
  //#endregion

  return (
    <Space direction="vertical" size={"small"} >
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
            label="IPD Date From: "
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
      <Table
        rowKey={(record) => record.an}
        loading={status === "loading"}
        columns={columns}
        dataSource={searchResult?.data || []}
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

const IpdSearchPage = () => {
  return withTheme(<IpdSearch />);
};

export default IpdSearchPage;
