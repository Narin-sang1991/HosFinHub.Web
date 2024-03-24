"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LeftOutlined, MenuUnfoldOutlined,
    ReconciliationOutlined, BookOutlined, AppstoreAddOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
const { Header, Content, Sider } = Layout;


type MenuItem = Required<MenuProps>['items'][number];
// type MenuNav = { id: number, icon: string, label: string, path: string };
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}
const MenuLayout = function MenuLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter()

    const menuItems: MenuProps['items'] = [

        getItem(<p onClick={() => router.push('/')}>My Task</p>, '1'),

        { type: 'divider' },

        getItem(<p onClick={() => router.push('/work-opd/blog')}>งานผู้ป่วยนอก</p>, 'sub1', <ReconciliationOutlined />, [
            getItem(<p onClick={() => router.push('/work-opd/search')}>ค้นหารายการ OPD</p>, '2'),
            getItem(<p onClick={() => router.push('/work-opd/transfer')}>ส่งข้อมูล OPD</p>, '3'),
        ]),
        getItem(<p onClick={() => router.push('/work-ipd/blog')}>งานผู้ป่วยใน</p>, 'sub2', <BookOutlined />, [
            getItem(<p onClick={() => router.push('/work-ipd/search')}>ค้นหารายการ IPD</p>, '4'),
            getItem(<p onClick={() => router.push('/work-ipd/transfer')}>ส่งข้อมูล IPD</p>, '5'),
        ]),

        { type: 'divider' },

        getItem(<p onClick={() => router.push('/master')}>Master Data</p>, 'sub9', <AppstoreAddOutlined />, [
            getItem(<p onClick={() => router.push('/master/company')}>Company </p>, 'm1'),
            getItem(<p onClick={() => router.push('/master/category')}>Category </p>, 'm2'),
        ]),
    ];

    return (
        <Layout>
            <Sider style={{ background: colorBgContainer }} theme="light"
                collapsible collapsed={collapsed}
                trigger={collapsed
                    ? <MenuUnfoldOutlined style={{ fontSize: '20px' }} />
                    : <LeftOutlined style={{ fontSize: '20px' }} />}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div style={{
                    padding: 15, margin: 2, textAlign: 'center',
                    borderRadius: borderRadiusLG, background: 'gray'
                }} >
                    LOGO
                </div>
                <Menu
                    theme="light"
                    mode="inline"
                    inlineCollapsed={collapsed}
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>

                </Header>
                <Breadcrumb style={{ margin: '0 0 5px 10px' }} separator=">" >
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    style={{
                        margin: '0px 16px 16px 16px',
                        padding: 24,
                        minHeight: 850,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

// const MenuLayout = () => {
//     return withTheme(<MenuAntd />);
//   }
export default MenuLayout;