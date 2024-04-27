import type { AdditionalPaymentModel, AdditPaymentModelEditorModel } from "@/store/free-additional/additionalModel";

export async function genarateAdditPaymentEditors(
  adpItems: AdditionalPaymentModel[]
) {
  let results: AdditPaymentModelEditorModel[] = [];
  await adpItems.forEach((adpItem, i) => {

    let dummyKey: number = i + 1;
    let data: AdditPaymentModelEditorModel = {
      ...adpItem,
      dummyKey,
      isDurty: false,
      hasError: false,
      typeDisplay: getAdpDisplay(adpItem.type),
      freeDrug: { id: adpItem.id, code: adpItem.code, unitPrice: adpItem.rate.toString() }
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
  let excludeProps = ['dummyKey', 'isDurty', 'freeDrug', 'typeDisplay', 'hasError'];
  adtEditors.forEach(item => {
    let data: AdditionalPaymentModel;
    Object.keys(item).forEach((prop) => {
      if (!excludeProps.includes(prop)) data = { ...data, [prop]: item[prop] };
    });
    results.push(data);
  });
  return results;
}
