import React from "react";
import { Tag, type TableColumnsType } from "antd";
import { WorkSearchModel } from "@/store/work/workSearchModel";
import { PatientModel } from "@/store/patient/patientModel";
import { getPatientID } from "./patient.constant";
import { OpdSearchModel } from "@/store/work-opd/opdSearchModel";
import { IpdSearchModel } from "@/store/work-ipd/ipdSearchModel";
import { InsureModel } from "@/store/financial/insureModel";

export const prefixColumns: TableColumnsType<any> = [
    {
        title: <p className="Center">เลขที่ hn</p>,
        dataIndex: "hn",
        key: "hn",
        width: 40,
        className: "Center",
        sorter: (a, b) => a.hn.localeCompare(b.hn),
    },
    {
        title: "ชื่อ-สกุล ผู้เข้ารับการรักษา",
        key: "work_pat",
        width: 80,
        render: (record) => <>{getPatientName(record)}</>,
    },
    {
        title: <p className="Center">เลขที่ประจำตัว</p>,
        key: "person_id",
        width: 80,
        className: "Center",
        render: (record) => <>{getRecordPatientID(record)}</>,
    },
];


export const suffixColumns: TableColumnsType<any> = [
    {
        title: <p className="Center">สิทธิ.</p>,
        key: "inscl",
        width: 50,
        className: "Center",
        render: (_: any, record) => <>{getRecordPatientInscl(record, _.rowKey)}</>,
    },
    {
        title: <p className="Center">สถานะการเคลม</p>,
        key: 'claimStatus',
        width: 50,
        className: "Center",
        render: (_: any, record) => <>{getClaimStatus(record)}</>,
    },
    {
        title: <p className="Center">Error</p>,
        dataIndex: "error",
        key: "error",
        width: 50,
        className: "Center",
        render: (value: any[]) => <>{getError(value)}</>,
    },
];

function getError(errorItems: any[]) {
    if (errorItems.length == 0) return "";

    let distinctValues = errorItems.map(t => { return t.code_error }).filter(uniqueFilter);
    return distinctValues.map((item) => { return <Tag color="volcano">{item}</Tag> });
}

function getPatientName(searchPatient: WorkSearchModel) {
    let patient: PatientModel = searchPatient.work_pat;
    // if (instanceOfWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as WorkSearchModel;
    //     if (workSearch.work_pat != undefined) patient = workSearch.work_pat;
    // }
    // if (instanceOfOpdWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as OpdSearchModel;
    //     if (workSearch.opd_pat != undefined) patient = workSearch.opd_pat;
    // }
    // if (instanceOfIpdWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as IpdSearchModel;
    //     if (workSearch.ipd_pat != undefined) patient = workSearch.ipd_pat;
    // }
    return getPatientFullName(patient);
}

export function getPatientFullName(patient: PatientModel | undefined) {
    if (patient == undefined) return "";
    return `${patient.title}${patient.fname}  ${patient.lname}`;
}

function getRecordPatientID(searchPatient: WorkSearchModel) {
    let patient: PatientModel = searchPatient.work_pat;

    // if (instanceOfWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as WorkSearchModel;
    //     if (workSearch.work_pat != undefined) patient = workSearch.work_pat;
    // }
    // if (instanceOfOpdWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as OpdSearchModel;
    //     if (workSearch.opd_pat != undefined) patient = workSearch.opd_pat;
    // }
    // if (instanceOfIpdWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as IpdSearchModel;
    //     if (workSearch.ipd_pat != undefined) patient = workSearch.ipd_pat;
    // }
    if (patient == undefined) return "";

    return getPatientID(patient.person_id);
}

function getClaimStatus(searchPatient: WorkSearchModel) {
    let claimLog = searchPatient.claim_log;
    if (claimLog == undefined) return "";
    if (claimLog.length == 0) return "รอตรวจสอบ";

    return claimLog[0].status?.description;
}

function getRecordPatientInscl(searchPatient: WorkSearchModel, key: string) {
    let patIns: InsureModel[] = searchPatient.work_pat?.pat_ins || [];
    // if (instanceOfWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as WorkSearchModel;
    //     if (workSearch.work_pat != undefined) patIns = workSearch.work_pat?.pat_ins;
    // }
    // if (instanceOfOpdWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as OpdSearchModel;
    //     if (workSearch.opd_pat != undefined) patIns = workSearch.opd_pat?.pat_ins;
    // }
    // if (instanceOfIpdWorkSearch(searchPatient)) {
    //     let workSearch = searchPatient as IpdSearchModel;
    //     if (workSearch.ipd_pat != undefined) patIns = workSearch.ipd_pat?.pat_ins;
    // }
    if (patIns == undefined) return "";
    if (patIns.length == 0) return "";

    const patientInscl = patIns.find((i) => i.seq === key)
    return patientInscl?.inscl || patIns[0].inscl;
}

function instanceOfWorkSearch(object: any): object is WorkSearchModel {
    return true;
}
function instanceOfOpdWorkSearch(object: any): object is OpdSearchModel {
    return true;
}
function instanceOfIpdWorkSearch(object: any): object is IpdSearchModel {
    return true;
}

export function uniqueFilter(value: any, index: number, self: any) {
    return self.indexOf(value) === index;
}