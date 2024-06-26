
import moment from "moment";
import { dateCalcFormat } from "@/client.constant/format.constant";

const defaultStrEmpty: string = "-";

export function getPatientID(personID: string) {
    if (personID !== undefined) {
        let idItems = Array.from(personID);
        let result: string = "";
        let strSplitor: string = " ";
        let includeSplitor: number[] = [0, 5, 10, 12]
        idItems.forEach((idItem, index) => {
            if (includeSplitor.includes(index)) {
                result = (result.trim().length === 0) ? `${idItem}${strSplitor}` : `${result}${strSplitor}${idItem}`;
            }
            else {
                result = (result.trim().length === 0) ? `${idItem}` : `${result}${idItem}`;
            }
        });
        return result;
    }
    return "";
}

export function getPatientSex(typeIn?: number) {
    if (defaultStrEmpty == undefined || !defaultStrEmpty) return defaultStrEmpty;
    if (typeIn == 1) return "เพศชาย";
    if (typeIn == 2) return "เพศหญิง";
    return defaultStrEmpty;
}

export const opTypes = [
    { key: 0, text: "Refer-ในบัญชีเครือข่ายเดียวกัน" },
    { key: 1, text: "Refer-นอกบัญชีเครือข่ายเดียวกัน" },
    { key: 2, text: "AE-ในบัญชีเครือข่าย" },
    { key: 3, text: "AE-นอกบัญชีเครือข่าย" },
    { key: 4, text: "OP-พิการ" },
    { key: 5, text: "OP-บัตรตัวเอง" },
    { key: 6, text: "Clearing House ศบส" },
    { key: 7, text: "OP-อื่นๆ (Individual data)" },
    { key: 8, text: "ผู้ป่วยกึ่ง OP/IP (NONI)" },
    { key: 9, text: "บริการแพทย์แผนไทย" },
]
export function getProviderType(opType?: number) {
    if (opType == undefined || !opType) return defaultStrEmpty;

    let opTypeItem = opTypes.find(t => t.key == opType);
    if (opTypeItem != undefined) return opTypeItem.text;
    else return defaultStrEmpty;
}

export function getDischargeOPD(typeOut?: number) {
    if (typeOut == undefined || !typeOut) return defaultStrEmpty;
    if (typeOut == 1) return "Discharge";
    if (typeOut == 2) return "Admit";
    if (typeOut == 3) return "Refer-out";
    if (typeOut == 4) return "Death-in-hospital";
    if (typeOut == 5) return "Death-before-arrive";
    if (typeOut == 6) return "Death-in-refer";
    if (typeOut == 7) return "Reject-to-heal";
    if (typeOut == 8) return "Escape";
    return defaultStrEmpty;
}

export function getVisitType(typeIn?: number) {
    if (typeIn == undefined || !typeIn) return defaultStrEmpty;
    if (typeIn == 1) return "Walk-in";
    if (typeIn == 2) return "Appointment";
    if (typeIn == 3) return "Refer-in";
    if (typeIn == 4) return "EMS-in";
    return defaultStrEmpty;
}

export function getAdmitType(svctype?: string) {
    if (svctype == 'I') return "IPD";
    if (svctype == 'A') return "Ambulatory Care";
    return defaultStrEmpty;
}

export function getDischargeStatus(status?: string) {
    if (status == '1') return "Complete Recovery";
    if (status == '2') return "Improved";
    if (status == '3') return "Not Improved";
    if (status == '4') return "Normal Delivery";
    if (status == '5') return "Un-Delivery";
    if (status == '6') return "Normal child discharged with mother";
    if (status == '7') return "Normal child discharged separately";
    if (status == '8') return "Stillbirth";
    if (status == '9') return "Dead";
    return defaultStrEmpty;
}

export function getDischargeIPD(typeOut?: string) {
    if (typeOut == '1') return "With Approval";
    if (typeOut == '2') return "Against Advice";
    if (typeOut == '3') return "By Escape";
    if (typeOut == '4') return "By Transfer";
    if (typeOut == '5') return "Other (specify)";
    if (typeOut == '8') return "Dead Autopsy";
    if (typeOut == '9') return "Dead Non autopsy";
    return defaultStrEmpty;
}

export function getAgeYear(bornDate: Date, seviceDate: Date) {
    if (bornDate !== undefined && seviceDate !== undefined) {
        let result: number = new Date(moment(seviceDate).format(dateCalcFormat)).getFullYear()
            - new Date(moment(bornDate).format(dateCalcFormat)).getFullYear();
        return Math.round(result);
    }
    return defaultStrEmpty;
}

export function getMarriage(typeIn?: number) {
    if (typeIn == 1) return "โสด";
    if (typeIn == 2) return "สมรส";
    if (typeIn == 3) return "หม้าย";
    if (typeIn == 4) return "หย่า";
    if (typeIn == 5) return "แยกกันอยู่";
    if (typeIn == 6) return "สมณะ";
    if (typeIn == 9) return "ไม่ทราบ";
    return defaultStrEmpty;
}

