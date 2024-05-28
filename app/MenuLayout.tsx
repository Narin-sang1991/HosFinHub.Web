"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image'
import { LeftOutlined, MenuUnfoldOutlined, } from "@ant-design/icons";
import { Breadcrumb, Col, Input, Layout, Menu, Row, Select, theme, Space } from "antd";
import type { MenuProps } from "antd";
import { MenuModel, menuList } from "@/client.constant/menu.constant";
import "@/app/globals.css";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

type MenuItem = Required<MenuProps>["items"][number];

type BreadcrumbRouteModel = {
  id: string,
  parent?: string,
  href: string,
  breadcrumbName: string,
};

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
  const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [visitType, setVisitType] = useState('opd');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbRouteModel[]>([]);
  const [focusBreadcrumbs, setFocusBreadcrumbs] = useState<BreadcrumbRouteModel[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let newMenuItems: MenuProps["items"] = genarateParentMenu();
    setMenuItems(newMenuItems);
  }, [])

  useEffect(() => {
    // console.log('pathname=>', pathname);
    let pathArr = pathname.split('/').filter(t => t != '');
    refreshBreadcrumb(pathArr);
  }, [pathname])

  //#region Genarate Menu
  function genarateParentMenu(): MenuItem[] {
    let tmpGroupId: number = 0;
    let results: MenuItem[] = [];
    let breadcrumbItems: BreadcrumbRouteModel[] = [];
    menuList.map(item => {

      if (tmpGroupId != item.groupId) {
        tmpGroupId = item.groupId ?? 0;
        results.push({ type: "divider" });
      }
      results.push(getItem(
        <p onClick={() => navComponentBoby(item)} >
          {item.label}
        </p >,
        item.id,
        <item.icon />,
        generateMenu(item.children)
      ));

      breadcrumbItems.push({
        id: item.id,
        href: item.breadcrumb || "",
        breadcrumbName: item.label
      });
      if (item.children != undefined) {
        item.children.forEach(child => breadcrumbItems.push({
          id: child.id,
          parent: item.breadcrumb || "",
          href: child.breadcrumb || "",
          breadcrumbName: child.label
        }));
      }

    });
    setBreadcrumbs(breadcrumbItems);
    return results;
  }

  function generateMenu(menuChilds: MenuModel[] | undefined): MenuItem[] | undefined {
    if (menuChilds == undefined) return;
    let results: MenuItem[] = menuChilds.map(item => {
      //To do [Narin.sa] : generate with Breadcrumb
      return getItem(
        <p onClick={() => navComponentBoby(item)} >
          {item.label}
        </p>,
        item.id,
        item.icon ? <item.icon /> : undefined,
        generateMenu(item.children)
      )
    });

    return results;
  }
  //#endregio

  function navComponentBoby(item: MenuModel) {
    if (!item.path) return;

    router.push(item.path);
  }

  function refreshBreadcrumb(pathArr: string[]) {
    let temps = breadcrumbs.filter(t =>
      t.href != undefined && pathArr.includes(t.href.replace('/', ''))
      && (t.parent == undefined
        || (t.parent != undefined && pathArr.includes(t.parent.replace('/', '')))
      )
    );
    setFocusBreadcrumbs([...temps]);
  }

  const onSearchSeq = (seq: string) => {
    if (seq == undefined || seq == "") return;

    if (visitType == 'opd') {
      router.push(`/work-opd/editor?id=${seq}`);
      return;
    }

    if (visitType == 'ipd') {
      router.push(`/work-ipd/editor?id=${seq}`);
      return;
    }
  }

  const selectVisitType = (
    <Select onChange={setVisitType} defaultValue={visitType}>
      <Option value="opd">OPD</Option>
      <Option value="ipd">IPD</Option>
    </Select>
  );

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
        {/* <div
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
        </div> */}
        <div className="Center" style={{ height: collapsed ? 70 : 100 }} >
          {/* <Image src={'/FinOsHub-TopMenu.png'} style={{ marginTop: -20 }}
            width={collapsed ? 80 : 160} height={collapsed ? 80 : 150} alt="Logo" /> */}
          <img src={'/FinOsHub-TopMenu.png'}
            style={{
              height: collapsed ? 80 : 160,
              marginTop: collapsed ? 0 : -25,
            }}
            className="cover" alt="fin-os-logo" />
        </div>
        <Menu theme="light" mode="inline"
          inlineCollapsed={collapsed}
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 15, background: colorBgContainer, height: '8vh', }}>
          <Row justify="end">
            <Col span={8}>
              <Input.Search addonBefore={selectVisitType}
                onSearch={onSearchSeq}
                allowClear placeholder="ค้นหาด้วยVN" />
            </Col>
          </Row>
        </Header>
        <Breadcrumb style={{ margin: "5px 10px" }} separator=">" >
          {
            focusBreadcrumbs.map(item => {
              return <Breadcrumb.Item key={item.id} href={item.href}>
                {item.breadcrumbName}
              </Breadcrumb.Item>
            })
          }
        </Breadcrumb>
        <Content
          style={{
            margin: "0px 10px 10px 10px",
            padding: "10px",
            minHeight: '88vh',
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
