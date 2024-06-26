
import moment from "moment";
import type { AdditionalPaymentModel, AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";
import { FeeScheduleSelectorModel } from "@/store/fee-additional/feeScheduleModel";
import { instanceOfIpdValids, IpdValidModel } from "@/store/work-ipd/ipdEditorModel";
import { instanceOfOpdValids, OpdValidModel } from "@/store/work-opd/opdEditorModel";
import { WorkValidModel } from "@/store/work/workValidModel";
import { dateInterfaceFormat } from "@/client.constant/format.constant";

export const allAdditTypes: { id: string, text: string }[] = [
  { id: "1", text: "HC (OPD)" },
  { id: "2", text: "อวัยวะเทียม/อุปกรณ์บำบัดรักษา" },
  { id: "3", text: "บริการอื่นๆที่ยังไม่ได้จัดหมวด" },
  { id: "4", text: "ค่าส่งเสริมป้องกัน/บริการเฉพาะ" },
  { id: "5", text: "Project code" },
  { id: "6", text: "การรักษามะเร็งตามโปรโตคอล" },
  { id: "7", text: "การรักษามะเร็งด้วยรังสีวิทยา" },
  { id: "8", text: "OP REFER และรายการ Fee Schedule" },
  { id: "9", text: "ตรวจวินิจฉัยด้วยวิธีพิเศษอื่นๆ" },
  { id: "10", text: "ค่าห้อง/ค่าอาหาร" },
  { id: "11", text: "เวชภัณฑ์ที่ไม่ใช่ยา" },
  { id: "12", text: "บริการทางทัตนกรรม" },
  { id: "13", text: "บริการสงเข็ม" },
  { id: "14", text: "บริการโลหิตและส่วนประกอบของโลหิต" },
  { id: "15", text: "ตรวจวินิจฉัยทางเทคนิคการแพทย์และพยาธิวิทยา" },
  { id: "16", text: "ตรวจวินิจฉัยและรักษาทางรังสีวิทยา" },
  { id: "17", text: "ค่าบริการทางการพยาบาล" },
  { id: "18", text: "อุปกรณ์ของใช้และเครื่องมือทางการแพทย์" },
  { id: "19", text: "ทำหัตถการ และบริการวิสัญญี" },
  { id: "20", text: "บริการทางกายภาพบำบัด และเวชกรรมฟื้นฟู" },
];

export const adpOptionalObj = {
  Code: undefined,
  TypeEditor: { id: undefined, text: "", disabled: true },
  Qty: undefined,
  Total: undefined,
  OverPayment: undefined,
  Rate: undefined,
  Dose: "",
  CagCode: undefined,
  CagText: undefined,
  CaType: undefined,
  SerialNo: undefined,
  TmltCode: "",
  Provider: undefined,
  BI: undefined,
  ItemSource: undefined,
  Gravida: undefined,
  GravidaWeek: undefined,
  LMP: undefined,
  ScreenCode: undefined,
  UseStatus: undefined,
  Status1: undefined,
  QtyDay: undefined,
};

export async function genarateAdditPaymentEditors(
  adpItems: AdditionalPaymentModel[],
  validItems: OpdValidModel[] | IpdValidModel[] | undefined
) {
  let results: AdditPaymentModelEditorModel[] = [];

  let itemAdpError: WorkValidModel[] = [];
  if (instanceOfOpdValids(validItems) && validItems.length > 0) itemAdpError = validItems[0].adp;
  if (instanceOfIpdValids(validItems) && validItems.length > 0) itemAdpError = validItems[0].adp;

  await adpItems.forEach((adpItem, i) => {
    const assignItemError = (itemAdpError || []).filter((i) => i.id === adpItem.id);
    const newFeeSchedule: FeeScheduleSelectorModel = { item_code: adpItem.code, item_name: "" };
    let typeText = getAdpDisplay(adpItem.type);
    const data: AdditPaymentModelEditorModel = {
      ...adpItem,
      dummyKey: adpItem.id.split('-')[0],
      isDurty: false,
      typeDisplay: typeText,
      typeEditor: { id: adpItem.type, text: typeText },
      feeSchedule: { ...newFeeSchedule },
      feeEditor: { ...newFeeSchedule },
      isFeeDrug: false,
      hasError: (assignItemError.length !== 0),
      validError: assignItemError,
    };
    results.push(data);
  });
  return results;
}

export function getAdpDisplay(type: string) {
  const index = allAdditTypes.findIndex(t => t.id == type);
  if (index > -1) {
    const allAdditType = allAdditTypes[index];
    return allAdditType.text;
  }
  return "-";
}

export function convertEditorToAdp(adtEditors: AdditPaymentModelEditorModel[]): AdditionalPaymentModel[] {
  let results: AdditionalPaymentModel[] = [];
  let excludeProps = ['dummyKey', 'isDurty', 'freeDrug', 'feeSchedule', 'feeEditor', 'isFeeDrug',
    'typeDisplay', 'typeEditor', 'validError', 'hasError'];
  adtEditors.forEach((item: any) => {
    let data: AdditionalPaymentModel = {
      id: "",
      hn: "",
      an: "",
      dateopd: new Date,
      type: "",
      code: "",
      qty: 0,
      rate: 0,
      seq: "",
      cagcode: "",
      dose: "",
      ca_type: "",
      serialno: "",
      totcopay: 0,
      use_status: "",
      total: 0,
      tmltcode: "",
      status1: "",
      bi: "",
      clinic: "",
      itemsrc: 0,
      provider: "",
      gravida: "",
      ga_week: "",
      dcip_e_screen: "",
      lmp: "",
    };
    Object.keys(item).forEach((prop) => {
      if (excludeProps.includes(prop)) return;
      
      let propValue = item[prop as keyof AdditionalPaymentModel];
      if (prop == 'dateopd') propValue = moment(item[prop]).format(dateInterfaceFormat);

      data = { ...data, [prop]: propValue };
    });
    results.push(data);
  });
  return results;
}

