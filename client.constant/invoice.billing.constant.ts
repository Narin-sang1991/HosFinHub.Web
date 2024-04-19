import { uuid } from "uuidv4";
import type {
  InvoiceItemModel,
  InvoiceEditorModel,
} from "@/store/financial/paymentModel";
import { OpdValidModel } from "@/store/work-opd/opdEditorModel";
const defaultStrEmpty: string = "-";

const allCharges: string[] = [
  "1",
  "2",
  "3",
  "4",
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

export function genarateAllCharges(
  invoiceItems: InvoiceItemModel[],
  validItem: OpdValidModel[] | undefined
) {
  let results: InvoiceEditorModel[] = [];

  allCharges.forEach((chargePrefix, i) => {
    let invoiceInCharges =
      invoiceItems.filter((t) => t.chrgitem.startsWith(chargePrefix)) || [];
    let dummyKey: number = i + 1;
    if (invoiceInCharges.length > 0) {
      let overAmount: number = 0.0;
      let approvedAmount: number = 0.0;
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
      let totalAmount: number = overAmount + approvedAmount;
      let invoiceItem = invoiceInCharges[0];
      let data: InvoiceEditorModel = {
        id: invoiceItem.id,
        seq: invoiceItem.seq,
        dummyKey,
        idDurty: false,
        totalAmount,
        overAmount,
        approvedAmount,
        chargeCode: invoiceItem.chrgitem,
        chargeDetail: getChargeDetails(invoiceItem.chrgitem),
        status: 1,
        valid: [],
      };
      results.push(data);
    } else {
      let chrgitem: string = chargePrefix + "1";
      let data: InvoiceEditorModel = {
        id: uuid(),
        seq: dummyKey,
        dummyKey,
        idDurty: false,
        totalAmount: 0.0,
        overAmount: 0.0,
        approvedAmount: 0.0,
        chargeCode: chrgitem,
        chargeDetail: getChargeDetails(chrgitem),
        status: 0,
        valid: [],
      };
      results.push(data);
    }
  });

  //assign error to charge.
  results = results.map((item) => {
    if (item.chargeCode === "41") {

      //item 41 = ยาที่นำไปใช้ต่อที่บ้าน
      validItem?.forEach((v) => {
        //dru error
        if (v.dru) {
          item.valid = item.valid?.concat(v.dru);
        }
      });
      return item;
    } else if (item.chargeCode === "31") {
      //item 31 = ยาและสารอาหารทางเส้นเลือดที่ใช้ในโรงพยาบาล
      validItem?.forEach((v) => {
        if (v.dru) {
          item.valid = item.valid?.concat(v.dru);
        }
      });
      return item;
    } else {
      return item;
    }
  });

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
