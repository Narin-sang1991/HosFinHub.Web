import moment from "moment";
import { dateInterfaceFormat, timeInterfaceFormat } from "./format.constant";
import { AccidentEmergencyModel } from "@/store/refer/accidentEmergencyModel";

const defaultStrEmpty: string = "-";
export const defaultReferObjective = "0000";

export const aeTypes = [
    { key: 'V', text: "ใช้ พรบ. ผู้ประสบภัยจากรถ" },
    { key: '0', text: "ใช้ พรบ. กองทุนเงินทดแทน" },
    { key: "B", text: "ใช้ทั้ง พรบ. ผู้ประสบภัยและ พรบ. กองทุนเงินทดแทน" },
]
export function getAeTypes(aeType?: string) {
    if (aeType == undefined || !aeType) return defaultStrEmpty;

    let aeTypeItem = aeTypes.find(t => t.key == aeType);
    if (aeTypeItem != undefined) return aeTypeItem.text;
    else return defaultStrEmpty;
}

export const emTypes = [
    { key: '1', text: "ต้องการรักษาเป็นการด่วน" },
    { key: '2', text: "ต้องผ่าตัดด่วน" },
    { key: "3", text: "โรคที่คณะกรรมการกำหนด" },
]
export function getEmTypes(emType?: string) {
    if (emType == undefined || !emType) return defaultStrEmpty;

    let emTypeItem = emTypes.find(t => t.key == emType);
    if (emTypeItem != undefined) return emTypeItem.text;
    else return defaultStrEmpty;
}

export const uCaseItems = [
    { key: 'A', text: "อุบัติเหตุ(Accident / Accident + Emergency)" },
    { key: 'E', text: "ฉุกเฉิน (Emergency)" },
    { key: 'N', text: "ไม่เป็น A / E" },
    { key: "I", text: "OP Refer ในจังหวัด" },
    { key: "O", text: "OP Refer ข้ามจังหวัด" },
    { key: "C", text: "ย้ายหน่วยบริการเกิดสิทธิทันที" },
    { key: "Z", text: "บริการเชิงรุก" },
]
export function getUcase(uCase?: string) {
    if (uCase == undefined || !uCase) return "ไม่เป็น A / E";

    let item = uCaseItems.find(t => t.key == uCase);
    if (item != undefined) return item.text;
    else return defaultStrEmpty;
}

export function convertEditorToAer(aerOriginals: AccidentEmergencyModel[]): AccidentEmergencyModel[] {
    let results: AccidentEmergencyModel[] = [];
    const dateTypes = ["dateopd", "aedate"];
    aerOriginals.forEach((item:any) => {
        let data: AccidentEmergencyModel;
        Object.keys(item).forEach((prop) => {
            let propValue = item[prop];
            if (dateTypes.includes(prop)) propValue = moment(propValue).format(dateInterfaceFormat)
            // if (prop == 'aetime') propValue = moment(propValue).format(timeInterfaceFormat)
            data = { ...data, [prop]: propValue };
        });
        results.push({ ...item });
    });
    return results;
}