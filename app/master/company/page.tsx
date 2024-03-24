"use client";

import React, { useState } from "react";
import { Button, Card, Form, Table, Input, Select } from 'antd';
import type { TableProps, TableColumnsType } from 'antd';
import { SearchOutlined, PlusCircleOutlined, } from '@ant-design/icons';
import withTheme from '../../../theme';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchAsync, selectResult, selectStatus } from "@/store/company/companySlice";
import type { Company } from "@/store/company/companyModel";
import '@/app/globals.css'

const { Option } = Select;
type CompanyProps = {}

const Company = function Company(props: CompanyProps) {

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
            SearchText: formCriteria.getFieldValue("SearchText"),
            CompanyGroupCode: formCriteria.getFieldValue("CompanyGroupCode"),
            CompanyType: formCriteria.getFieldValue("CompanyType"),

            indexOffset: index,
            paging: pageSize,
            sorting: (sorter ? sorter.field : undefined),
            sortMode: (sorter ? (sorter.order === "descend" ? 1 : 0) : undefined),
        }
    }
    //#endregion

    //#region Local Filter Data
    const onTableCriteriaChange: TableProps<Company>['onChange'] = (pagination, filters, sorter, extra) => {
        onSearch(pagination.current, sorter);
    };

    const columns: TableColumnsType<Company> = [
        {
            title: "Code",
            dataIndex: "CompanyCode",
            key: "CompanyCode",
            width: 50,
            ellipsis: true,
            sorter: (a, b) => a.CompanyCode.localeCompare(b.CompanyCode),
        },
        {
            title: "Name",
            dataIndex: "CompanyShortName",
            key: "CompanyShortName",
            width: 80,
            ellipsis: true,
            sorter: (a, b) => a.CompanyShortName.localeCompare(b.CompanyShortName),
        },
        {
            title: "Full Name",
            dataIndex: "CompanyFullName",
            key: "CompanyFullName",
            width: 150,
            ellipsis: true,
            sorter: (a, b) => a.CompanyFullName.localeCompare(b.CompanyFullName),
        },
        {
            title: "Type",
            dataIndex: "CompanyTypeDisplay",
            key: "CompanyTypeDisplay",
            width: 80,
        },
        {
            title: "Group",
            dataIndex: "CompanyGroupCode",
            key: "CompanyGroupCode",
            width: 80,
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
                        name="CompanyGroupCode"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Company Group" allowClear maxLength={10} />
                    </Form.Item>
                    <Form.Item
                        // label="Type: "
                        name="CompanyType"
                        rules={[{ required: false }]}
                    >
                        <Select placeholder="Company Type" defaultValue={null} style={{ width: 150 }} >
                            <Option value={null}>All</Option>
                            <Option value={10}>Holding</Option>
                            <Option value={20}>Operation</Option>
                            <Option value={30}>Construction</Option>
                        </Select>
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
                    <Form.Item label="" name="add_item">
                        <Button
                            key="add_item"
                            icon={<PlusCircleOutlined />}
                            disabled={status === "loading"}
                        // onClick={() => createItem()}
                        >
                            {"Add Item"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Table
                rowKey={record => record.CompanyID}
                loading={status === "loading"}
                columns={columns}
                dataSource={searchResult.Items || []}
                pagination={{ current: pageIndex, pageSize: pageSize, total: searchResult.TotalItem || 10, }}
                onChange={onTableCriteriaChange}
                size="small" className={"MasterBackground"} style={{ margin: "10px 0", height: "600px", width: "100%" }}
                sticky scroll={{ x: 1000 }}
            />
        </>
    );
}

const CompanyPage = () => {
    return withTheme(<Company />);
}
export default CompanyPage;

