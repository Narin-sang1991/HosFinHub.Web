import type { AdditionalPaymentModel, AdditPaymentModelEditorModel } from "@/store/fee-additional/additionalModel";

export async function genarateAdditPaymentEditors(
  adpItems: AdditionalPaymentModel[]
) {
  let results: AdditPaymentModelEditorModel[] = [];
  await adpItems.forEach((adpItem, i) => {

    let dummyKey: number = i + 1;
    let newFeeDrug = { id: adpItem.id, code: adpItem.code, unitPrice: adpItem.rate.toString() };
    let data: AdditPaymentModelEditorModel = {
      ...adpItem,
      dummyKey,
      isDurty: false,
      hasError: false,
      typeDisplay: getAdpDisplay(adpItem.type),
      feeDrug: { ...newFeeDrug },
      feeEditor: { ...newFeeDrug },
      isFeeDrug: true,
    };
    results.push(data);
  });
  return results;
}

export function getAdpDisplay(type: string) {
  if (type.startsWith("1")) return "HC (OPD)";
  if (type.startsWith("2")) return "อวัยวะเทียม/อุปกรณ์บำบัดรักษา";
  if (type.startsWith("3")) return "บริการอื่นๆที่ยังไม่ได้จัดหมวด";
  if (type.startsWith("4")) return "ค่าส่งเสริมป้องกัน/บริการเฉพาะ";
  if (type.startsWith("5")) return "Project code";
  if (type.startsWith("6")) return "การรักษามะเร็งตามโปรโตคอล";
  if (type.startsWith("7")) return "การรักษามะเร็งด้วยรังสีวิทยา";
  if (type.startsWith("8")) return "OP REFER และรายการ Fee Schedule";
  if (type.startsWith("9")) return "ตรวจวินิจฉัยด้วยวิธีพิเศษอื่นๆ";
  if (type.startsWith("10")) return "ค่าห้อง/ค่าอาหาร";
  if (type.startsWith("11")) return "เวชภัณฑ์ที่ไม่ใช่ยา";
  if (type.startsWith("12")) return "บริการทางทัตนกรรม";
  if (type.startsWith("13")) return "บริการสงเข็ม";
  if (type.startsWith("14")) return "บริการโลหิตและส่วนประกอบของโลหิต";
  if (type.startsWith("15")) return "ตรวจวินิจฉัยทางเทคนิคการแพทย์และพยาธิวิทยา";
  if (type.startsWith("16")) return "ตรวจวินิจฉัยและรักษาทางรังสีวิทยา";
  if (type.startsWith("17")) return "ค่าบริการทางการพยาบาล";
  if (type.startsWith("18")) return "อุปกรณ์ของใช้และเครื่องมือทางการแพทย์";
  if (type.startsWith("19")) return "ทำหัตถการ และบริการวิสัญญี";
  if (type.startsWith("20")) return "บริการทางกายภาพบำบัด และเวชกรรมฟื้นฟู";

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
