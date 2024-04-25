
import { v4 as uuidv4 } from "uuid";
import type { InvoiceItemModel, InvoiceItemEditorModel, } from "@/store/financial/invoiceItemModel";
import { OpdValidModel } from "@/store/work-opd/opdEditorModel";
const defaultStrEmpty: string = "-";

//#region File and Code
export const drugInChargePrefix = "3";
export const drugExChargePrefix = "4";
export const drugFileCode = "DRU";


export const additionalPaymentChargePrefix = "J";
export const additionalPaymentFileCode = "ADP";
//#endregion

const allCharges: string[] = [
  "1",
  "2",
  drugInChargePrefix,
  drugExChargePrefix,
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
];

export async function genarateAllCharges(
  invoiceItems: InvoiceItemModel[],
  validItem: OpdValidModel[] | undefined
): Promise<InvoiceItemEditorModel[]> {
  let results: InvoiceItemEditorModel[] = [];

  await allCharges.forEach((chargePrefix, i) => {
    let invoiceInCharges = invoiceItems.filter((t) => t.chrgitem.startsWith(chargePrefix)) || [];
    let dummyKey: number = i + 1;
    if (invoiceInCharges.length > 0) {
      let overAmount: number = 0;
      let approvedAmount: number = 0;
      invoiceInCharges.forEach((invoiceInCharge) => {
        if (invoiceInCharge.chrgitem.endsWith("1")) {
          approvedAmount = invoiceInCharge.amount;
          return;
        }
        if (invoiceInCharge.chrgitem.endsWith("2")) {
          overAmount = invoiceInCharge.amount;
          return;
        }
      });
      let totalAmount: number = Number(overAmount.toString()) + Number(approvedAmount.toString());
      let invoiceItem = invoiceInCharges[0];
      let data: InvoiceItemEditorModel = {
        ...invoiceItem,
        dummyKey,
        isDurty: false,
        totalAmount: totalAmount,
        overAmount,
        approvedAmount,
        chargeDetail: getChargeDetails(invoiceItem.chrgitem),
        status: 1,
        valid: [],
      };
      results.push(data);
    } else {
      let chrgitem: string = chargePrefix + "1";
      let data: InvoiceItemEditorModel = {
        id: uuidv4(),
        seq: '0',
        dummyKey,
        isDurty: false,
        totalAmount: 0.0,
        overAmount: 0.0,
        approvedAmount: 0.0,
        chrgitem: chrgitem,
        chargeDetail: getChargeDetails(chrgitem),
        status: 0,
        valid: [],
      };
      results.push(data);
    }
  });

  //#region Assign error to charge.
  results = await results.map((item) => {
    if (item.chrgitem === "41") {

      //item 41 = ยาที่นำไปใช้ต่อที่บ้าน
      validItem?.forEach((v) => {
        //dru error
        if (v.dru && item.totalAmount > 0) {
          item.valid = item.valid?.concat(v.dru);
        }
      });
      return item;
    } else if (item.chrgitem === "31") {
      //item 31 = ยาและสารอาหารทางเส้นเลือดที่ใช้ในโรงพยาบาล
      validItem?.forEach((v) => {
        if (v.dru && item.totalAmount > 0) {
          item.valid = item.valid?.concat(v.dru);
        }
      });
      return item;
    } else {
      return item;
    }
  });
  //#endregion

  return results;
}

export function getChargeDetails(chargeCode: string) {
  if (chargeCode.startsWith("1")) return "ค่าห้อง/ค่าอาหาร";
  if (chargeCode.startsWith("2")) return "อวัยวะเทียม/อุปกรณ์ในการบำบัดรักษา";
  if (chargeCode.startsWith("3"))
    return "ยาและสารอาหารทางเส้นเลือดที่ใช้ในโรงพยาบาล";
  if (chargeCode.startsWith("4")) return "ยาที่นำไปใช้ต่อที่บ้าน";
  if (chargeCode.startsWith("5")) return "เวชภัณฑ์ที่ไม่ใช่ยา";
  if (chargeCode.startsWith("6")) return "บริการโลหิตและส่วนประกอบของโลหิต";
  if (chargeCode.startsWith("7"))
    return "ตรวจวินิจฉัยทางเทคนิคการแพทย์และพยาธิวิทยา";
  if (chargeCode.startsWith("8")) return "ตรวจวินิจฉัยและรักษาทางรังสีวิทยา";
  if (chargeCode.startsWith("9")) return "ตรวจวินิจฉัยด้วยวิธีพิเศษอื่นๆ";
  if (chargeCode.startsWith("A"))
    return "อุปกรณ์ของใช้และเครื่องมือทางการแพทย์";
  if (chargeCode.startsWith("B")) return "ทำหัตถการ และบริการวิสัญญี";
  if (chargeCode.startsWith("C")) return "ค่าบริการทางการพยาบาล";
  if (chargeCode.startsWith("D")) return "บริการทางทัตนกรรม";
  if (chargeCode.startsWith("E"))
    return "บริการทางกายภาพบำบัด และเวชกรรมฟื้นฟู";
  if (chargeCode.startsWith("F"))
    return "บริการสงเข็ม/การบำบัดของผู้ประกอบโรคศิลปะอื่นๆ";
  if (chargeCode.startsWith("G")) return "ค่าห้องผ่าตัดและห้องคลอด";
  if (chargeCode.startsWith("H")) return "ค่าธรรมเนียมบุคลกรทางการแพทย์";
  if (chargeCode.startsWith("I")) return "บริการอื่นๆ และส่งเสริมป้องกันโรค";
  if (chargeCode.startsWith("J")) return "บริการอื่นๆ ที่ยังไม่ได้จัดหมวด";
  if (chargeCode.startsWith("K")) return "พรบ.";
  return defaultStrEmpty;
}

export function getClaimStatusText(status: number) {
  let result: string =
    status == 0
      ? "ไม่มีรายการ"
      : status == 1
        ? "รอดำเนินการ"
        : status == 2
          ? "รอพิจารณา"
          : status == 3
            ? "อนุมัติแล้ว"
            : status == 4
              ? "ไม่อนุมัติ"
              : defaultStrEmpty;
  return result;
}

export function getStatusDisplayType(status: number) {
  let result: any =
    status == 0
      ? "secondary"
      : status == 1 || status == 2
        ? "warning"
        : status == 3
          ? "success"
          : status == 4
            ? "danger"
            : "secondary";
  return result;
}

export function convertEditorToCha(chaEditors: InvoiceItemEditorModel[]): InvoiceItemModel[] {
  let results: InvoiceItemModel[] = [];
  let chaItems: InvoiceItemEditorModel[] = [...chaEditors].filter(t => t.seq != '0');
  let excludeProps = ['dummyKey', 'isDurty', 'totalAmount', 'overAmount', 'approvedAmount', 'status', 'valid'];
  chaItems.forEach(item => {
    let data: InvoiceItemModel;
    Object.keys(item).forEach((prop) => {
      if (!excludeProps.includes(prop)) data = { ...data, [prop]: item[prop] };
    });
    data.amount = item.totalAmount;
    results.push(data);
  });
  return results;
}

