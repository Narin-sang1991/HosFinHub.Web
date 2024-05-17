"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LeftOutlined,
  MenuUnfoldOutlined,
  ReconciliationOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Col, Input, Layout, Menu, Row, theme } from "antd";
import type { MenuProps } from "antd";
import "@/app/globals.css";
const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];
// type MenuNav = { id: number, icon: string, label: string, path: string };
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
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
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const menuItems: MenuProps["items"] = [
    getItem(<p className="Center" onClick={() => router.push("/")}>{collapsed ? "Task" : "My Task"}</p>, "1"),

    { type: "divider" },

    getItem("งานผู้ป่วยนอก", "sub1", <ReconciliationOutlined />, [
      getItem(
        <p onClick={() => router.push("/work-opd/search")}>ค้นหารายการ OPD</p>,
        "2"
      ),
      getItem(
        <p onClick={() => router.push("/work-opd/transfer")}>ส่งข้อมูล OPD</p>,
        "3"
      ),
      getItem(
        <p onClick={() => router.push("/work-opd/history")}>ประวัติการส่ง OPD</p>,
        "03"
      ),
    ]),
    getItem("งานผู้ป่วยใน", "sub2", <BookOutlined />, [
      getItem(
        <p onClick={() => router.push("/work-ipd/search")}>ค้นหารายการ IPD</p>,
        "4"
      ),
      getItem(
        <p onClick={() => router.push("/work-ipd/transfer")}>ส่งข้อมูล IPD</p>,
        "5"
      ),
      getItem(
        <p onClick={() => router.push("/work-ipd/history")}>ประวัติการส่ง ณPD</p>,
        "05"
      ),
    ]),
    getItem("ประมวลผลข้อมูล", "sub3", <SettingOutlined />, [
      getItem(<p onClick={() => router.push("/process")}>ประมวลผล</p>, "6"),
    ]),

    // { type: 'divider' },

    // getItem(<p onClick={() => router.push('/master')}>Master Data</p>, 'sub9', <AppstoreAddOutlined />, [
    //     getItem(<p onClick={() => router.push('/master/company')}>Company </p>, 'm1'),
    //     getItem(<p onClick={() => router.push('/master/category')}>Category </p>, 'm2'),
    // ]),
  ];

  const onSearchSeq = (seq: string) => {
    if(seq == undefined || seq == "") return;
    
    router.push(`/work-opd/editor?id=${seq}`)
  }

  return (
    <Layout>
      <Sider
        style={{ background: colorBgContainer }}
        theme="light"
        collapsible
        collapsed={collapsed}
        trigger={
          collapsed ? (
            <MenuUnfoldOutlined style={{ fontSize: "20px" }} />
          ) : (
            <LeftOutlined style={{ fontSize: "20px" }} />
          )
        }
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            padding: 15,
            margin: 2,
            textAlign: "center",
            borderRadius: borderRadiusLG,
            background: "green",
            fontWeight: "bold",
            fontSize: "18px"
          }}
        >
          {"Financial Data \n HospitalOS"}
        </div>
        <Menu
          theme="light"
          mode="inline"
          inlineCollapsed={collapsed}
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 15, background: colorBgContainer }}>
          <Row justify="end">
            <Col span={8}> <Input.Search onSearch={onSearchSeq} allowClear placeholder="ค้นหาด้วยVN" /></Col>
          </Row>
        </Header>
        <Breadcrumb style={{ margin: "0 0 5px 10px" }} separator=">">
          <Breadcrumb.Item>OPD</Breadcrumb.Item>
          <Breadcrumb.Item>Search</Breadcrumb.Item>
          <Breadcrumb.Item>Edit</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{
            margin: "0px 16px 16px 16px",
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
