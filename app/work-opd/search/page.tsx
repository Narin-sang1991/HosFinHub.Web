"use client";

import React, { useState } from "react";
import { Button, Card, Form, Table, Input, Select } from 'antd';
import type { TableProps, TableColumnsType } from 'antd';
import { SearchOutlined, PlusCircleOutlined, } from '@ant-design/icons';
import withTheme from '../../../theme';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchAsync, selectResult, selectStatus } from "@/store/work-opd/workOpdSlice";
import type { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import '@/app/globals.css'

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

    const columns: TableColumnsType<OpdSearchModel> = [
        {
            title: "HN",
            dataIndex: "hn",
            key: "hn",
            width: 80,
            ellipsis: true,
            sorter: (a, b) => a.hn.localeCompare(b.hn),
        },
        {
            title: "SEQ.",
            dataIndex: "seq",
            key: "seq",
            width: 80,
            ellipsis: true,
            sorter: (a, b) => a.seq.localeCompare(b.seq),
        },
        // {
        //     title: "Full Name",
        //     dataIndex: "dateopd",
        //     key: "dateopd",
        //     width: 60,
        //     ellipsis: true,
        //     sorter: (a, b) => a.dateopd.localeCompare(b.dateopd),
        // },
        // {
        //     title: "Type",
        //     dataIndex: "OpdSearchTypeDisplay",
        //     key: "OpdSearchTypeDisplay",
        //     width: 80,
        // },
        // {
        //     title: "Group",
        //     dataIndex: "OpdSearchGroupCode",
        //     key: "OpdSearchGroupCode",
        //     width: 80,
        // },
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

