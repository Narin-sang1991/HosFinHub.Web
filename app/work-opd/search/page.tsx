"use client";

import React, { useState } from "react";
import { Button, Card, Form, Table, Input, Select } from 'antd';
import type { TableProps, TableColumnsType } from 'antd';
import { SearchOutlined, PlusCircleOutlined, } from '@ant-design/icons';
import moment from "moment";
import withTheme from '../../../theme';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchAsync, selectResult, selectStatus } from "@/store/work-opd/workOpdSlice";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import '@/app/globals.css'

// moment.locale('th');
const { Option } = Select;
type OpdSearchProps = {}

const OpdSearch = function OpdSearch(props: OpdSearchProps) {

    const dispatch = useAppDispatch();
    const [formCriteria] = Form.useForm();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(15);
    const status = useAppSelector(selectStatus);
    const searchResult = useAppSelector(selectResult);

    //#region Search 
    async function onSearch(index?: number, sorter?: any) {
        // console.log("page-searchAsync-->");
        setPageIndex(index ?? 1);
        (async () => {
            let criteria = packCriteria(index ?? 1, sorter);
            await dispatch(searchAsync(criteria));
        })();
    }
    function packCriteria(index: number, sorter?: any) {
        return {
            startDate: "2024/01/01",
            endDate: "2024/01/02"
        }
    }
    //#endregion

    //#region Local Filter Data
    const onTableCriteriaChange: TableProps<OpdSearchModel>['onChange'] = (pagination, filters, sorter, extra) => {
        onSearch(pagination.current, sorter);
    };

    function getPatientName(record: OpdSearchModel) {
        if ((record.opd_pat || []).length > 0) {
            let patient = record.opd_pat[0];
            return `${patient.title}${patient.fname}  ${patient.lname}`
        }
        return "";
    }

    function getPatientID(record: OpdSearchModel) {
        if ((record.opd_pat || []).length > 0) {
            let patient = record.opd_pat[0];
            let idItems = Array.from(patient.person_id);
            let result: string = "";
            let includeSplitor: number[] = [0, 5, 10, 12]
            idItems.forEach((idItem, index) => {
                if (includeSplitor.includes(index)) {
                    result = (result.trim().length === 0) ? `${idItem} ` : `${result} ${idItem}`;
                }
                else {
                    result = (result.trim().length === 0) ? `${idItem}` : `${result}${idItem}`;
                }
            });
            return result;
        }
        return "";
    }

    const columns: TableColumnsType<OpdSearchModel> = [
        {
            title: "HN",
            dataIndex: "hn",
            key: "hn",
            width: 40,
            ellipsis: true,
            sorter: (a, b) => a.hn.localeCompare(b.hn),
        },
        {
            title: "SEQ.",
            dataIndex: "seq",
            key: "seq",
            width: 40,
            ellipsis: true,
            sorter: (a, b) => a.seq.localeCompare(b.seq),
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
                    moment(date).format('DD MMM YYYY')
                );
            },
        },
        {
            title: "Patient Name",
            key: "opd_pat",
            width: 80,
            render: (record) => (
                <>{getPatientName(record)}</>
            )
        },
        {
            title: "Person ID",
            key: "person_id",
            width: 80,
            render: (record) => (
                <>{getPatientID(record)}</>
            )
        },
    ]
    //#endregion 
    return (
        <>
            <Card bordered={true} style={{ borderBottomColor: "LightGray" }} className={"MasterBackground"} >
                <Form
                    layout="inline"
                    name="criteriaFormSearch"
                    form={formCriteria}
                    onFinish={() => onSearch(1)}
                >
                    <Form.Item
                        // label="Text: "
                        name="SearchText"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Full Name" allowClear maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        // label="Group: "
                        name="OpdSearchGroupCode"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="OpdSearch Group" allowClear maxLength={10} />
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
                </Form>
            </Card>
            <Table
                rowKey={record => record.id}
                loading={status === "loading"}
                columns={columns}
                dataSource={searchResult || []}
                pagination={{ current: pageIndex, pageSize: pageSize, total: searchResult.length || 10, }}
                onChange={onTableCriteriaChange}
                size="small" className={"MasterBackground"} style={{ margin: "10px 0", height: "600px", width: "100%" }}
                sticky scroll={{ x: 1000 }}
            />
        </>
    );
}

const OpdSearchPage = () => {
    return withTheme(<OpdSearch />);
}
export default OpdSearchPage;

