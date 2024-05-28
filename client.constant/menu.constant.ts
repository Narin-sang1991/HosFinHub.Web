
import { v4 as uuidv4 } from "uuid";
import {
    HomeOutlined, ReconciliationOutlined,
    ClusterOutlined, QrcodeOutlined,
} from "@ant-design/icons";

export interface MenuModel {
    id: string;
    ordinal: number;
    groupId?: number;
    icon?: any;
    label: string;
    path?: string;
    breadcrumb: string;
    children?: MenuModel[];
};

export const menuList: MenuModel[] = [
    {
        id: uuidv4(),
        ordinal: 1,
        groupId: 1,
        icon: HomeOutlined,
        label: "Task",
        path: "/",
        breadcrumb: '/'
    },
    {
        id: uuidv4(),
        ordinal: 2,
        groupId: 2,
        icon: ReconciliationOutlined,
        label: "งานผู้ป่วยนอก",
        breadcrumb: '/work-opd',
        children: [{
            id: uuidv4(),
            ordinal: 1,
            label: "OPD ค้นหารายการ",
            path: "/work-opd/search",
            breadcrumb: '/search',
        }, {
            id: uuidv4(),
            ordinal: 3,
            label: "OPD ส่งข้อมูล",
            path: "/work-opd/transfer",
            breadcrumb: '/transfer',
        }, {
            id: uuidv4(),
            ordinal: 4,
            label: "OPD ประวัติการส่ง",
            path: "/work-opd/history",
            breadcrumb: '/history',
        },]
    },
    {
        id: uuidv4(),
        ordinal: 3,
        groupId: 2,
        icon: ClusterOutlined,
        label: "งานผู้ป่วยใน",
        breadcrumb: '/work-ipd',
        children: [{
            id: uuidv4(),
            ordinal: 1,
            label: "IPD ค้นหารายการ",
            path: "/work-ipd/search",
            breadcrumb: '/search',
        }, {
            id: uuidv4(),
            ordinal: 2,
            label: "IPD ส่งข้อมูล",
            path: "/work-ipd/transfer",
            breadcrumb: '/transfer',
        }, {
            id: uuidv4(),
            ordinal: 3,
            label: "IPD ประวัติการส่ง",
            path: "/work-ipd/history",
            breadcrumb: '/history',
        }]
    },
    {
        id: uuidv4(),
        ordinal: 4,
        groupId: 2,
        icon: ClusterOutlined,
        label: "ประมวลผลข้อมูล",
        path: "/process",
        breadcrumb: '/process',
    },
]