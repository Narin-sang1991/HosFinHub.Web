import type { AdditionalPaymentModel, AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";

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
  CagCode: undefined,
  CaType: undefined,
  CagText: undefined,
  SerialNo: undefined,
  Gravida: undefined,
  GravidaWeek: undefined,
  LMP: undefined,
};

export async function genarateAdditPaymentEditors(
  adpItems: AdditionalPaymentModel[]
) {
  let results: AdditPaymentModelEditorModel[] = [];
  await adpItems.forEach((adpItem, i) => {

    let dummyKey: number = i + 1;
    let newFeeDrug = { id: adpItem.id, code: adpItem.code, unitPrice: adpItem.rate.toString() };
    let typeText = getAdpDisplay(adpItem.type);
    const data: AdditPaymentModelEditorModel = {
      ...adpItem,
      dummyKey,
      isDurty: false,
      hasError: false,
      typeDisplay: typeText,
      typeEditor: { id: adpItem.type, text: typeText },
      feeDrug: { ...newFeeDrug },
      feeEditor: { ...newFeeDrug },
      isFeeDrug: true,
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
  let excludeProps = ['dummyKey', 'isDurty', 'freeDrug', 'feeSchedule', 'feeEditor', 'isFeeDrug', 'typeDisplay', 'hasError'];
  adtEditors.forEach(item => {
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
      if (!excludeProps.includes(prop)) data = { ...data, [prop]: item[prop] };
    });
    results.push(data);
  });
  return results;
}
