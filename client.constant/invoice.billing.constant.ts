
import { v1 as newUid } from "uuid";
import moment from "moment";
import type { InvoiceItemModel, InvoiceItemEditorModel, } from "@/store/financial/invoiceItemModel";
import { OpdValidModel } from "@/store/work-opd/opdEditorModel";
import { InvoiceModel } from "@/store/financial/invoiceModel";
import { PatientDetailModel } from "@/store/patient/patientModel";
import { ChargeModel } from "@/store/financial/chargeModel";
import { IpdValidModel } from "@/store/work-ipd/ipdEditorModel";
import { VisitDetailModel } from "@/store/work/workEditorModel";
import { dateInterfaceFormat } from "@/client.constant/format.constant";
const defaultStrEmpty: string = "-";

//#region File and Code
export const roomAndFoodChargePrefix = "1";
export const roomAndFoodAdpType = ["10"];

export const instrumentChargePrefix = "2";
export const instrumentAdpType = ["2"];

export const drugInChargePrefix = "3";
export const drugExChargePrefix = "4";
export const drugFileCode = "DRU";
export const drugAdpType = [];

export const nonDrugChargePrefix = "5";
export const nonDrugAdpType = ["11"];

export const bloodAndCpnChargePrefix = "6";
export const bloodAndCpnAdpType = ["14"];

export const diagnosisMedChargePrefix = "7";
export const diagnosisMedAdpType = ["15"];

export const diagnosisXrayChargePrefix = "8";
export const diagnosisXrayAdpType = ["16"];

export const diagnosisSpecialChargePrefix = "9";
export const diagnosisSpecialAdpType = ["9"];

export const equipmentMedChargePrefix = "A";
export const equipmentMedAdpType = ["18"];

export const phyProcedureChargePrefix = "B";
export const phyProcedureAdpType = ["19"];

export const feeServicesMedChargePrefix = "C";
export const feeServicesMedAdpType = ["17"];

export const dentistryChargePrefix = "D";
export const dentistryAdpType = ["12"];

export const phyTherapyMedChargePrefix = "E";
export const phyTherapyMedAdpType = ["20"];

export const otherTherapyMedChargePrefix = "F";
export const otherTherapyMedAdpType = ["13"];

export const operRoomChargePrefix = "G";
export const operRoomAdpType = [];

export const personnelMedChargePrefix = "H";
export const personnelMedAdpType = [];

export const diseasePreventChargePrefix = "I";
export const diseasePreventAdpType = [];

export const additionalPaymentChargePrefix = "J";
export const additionalPaymentAdpType = ["1", "3", "4", "5", "6", "7", "8", "0", "00"];
export const additionalPaymentFileCode = "ADP";

export const statuteChargePrefix = "K";
export const statuteAdpType = [];
//#endregion


//#region All Charge Items
const allCharges: string[] = [
  roomAndFoodChargePrefix,
  instrumentChargePrefix,
  drugInChargePrefix,
  drugExChargePrefix,
  nonDrugChargePrefix,
  bloodAndCpnChargePrefix,
  diagnosisMedChargePrefix,
  diagnosisXrayChargePrefix,
  diagnosisSpecialChargePrefix,
  equipmentMedChargePrefix,
  phyProcedureChargePrefix,
  feeServicesMedChargePrefix,
  dentistryChargePrefix,
  phyTherapyMedChargePrefix,
  otherTherapyMedChargePrefix,
  operRoomChargePrefix,
  personnelMedChargePrefix,
  diseasePreventChargePrefix,
  additionalPaymentChargePrefix,
  statuteChargePrefix,
];

export const allChargeItems: ChargeModel[] = allCharges.map(chargePrefix => {
  let item: ChargeModel = {
    prefix: chargePrefix,
    name: getChargeText(chargePrefix),
    chargeTypes: getChargeTypes(chargePrefix),
  }
  return item;
})

//#endregion

export async function genarateAllCharges(
  invoiceItems: InvoiceItemModel[],
  validItem: OpdValidModel[] | IpdValidModel[] | undefined
): Promise<InvoiceItemEditorModel[]> {
  let results: InvoiceItemEditorModel[] = [];

  await allCharges.forEach((chargePrefix, i) => {
    let invoiceInCharges = [...invoiceItems.filter((t) => t.chrgitem.startsWith(chargePrefix))] || [];
    let dummyKey: number = i + 1;
    if (invoiceInCharges.length > 0) {
      let totalAmount: number = 0;
      let overAmount: number = 0;
      invoiceInCharges.forEach((invoiceInCharge) => {
        if (invoiceInCharge.chrgitem.endsWith("1")) {
          totalAmount = invoiceInCharge.amount;
          return;
        }
        if (invoiceInCharge.chrgitem.endsWith("2")) {
          overAmount = invoiceInCharge.amount;
          return;
        }
      });
      let invoiceItem = invoiceInCharges[0];
      let data: InvoiceItemEditorModel = {
        ...invoiceItem,
        dummyKey,
        isDurty: false,
        totalAmount: totalAmount,
        overAmount: overAmount,
        chargeDetail: getChargeText(invoiceItem.chrgitem),
        status: 1,
        valid: [],
      };
      results.push(data);
    } else {
      let chrgitem: string = chargePrefix + "1";
      let data: InvoiceItemEditorModel = {
        id: newUid(),
        seq: '0',
        dummyKey,
        isDurty: false,
        totalAmount: 0.0,
        overAmount: 0.0,
        chrgitem: chrgitem,
        chargeDetail: getChargeText(chrgitem),
        status: 0,
        valid: [],
        hn: "",
        date: new Date,
        amount: 0,
        person_id: ""
      };
      results.push(data);
    }
  });

  //#region Assign error to charge.
  // console.log('validItem=>', validItem);
  results = await results.map((item) => {
    if (item.chrgitem.startsWith(drugExChargePrefix)) {
      //item 41 | 42 = ยาที่นำไปใช้ต่อที่บ้าน
      validItem?.forEach((v) => {
        if (v.dru && (item.totalAmount > 0 || item.overAmount > 0)) {
          item.valid = item.valid?.concat(v.dru);
        }
      });
      return item;
    } else if (item.chrgitem.startsWith(drugInChargePrefix)) {
      //item 31 | 32 = ยาและสารอาหารทางเส้นเลือดที่ใช้ในโรงพยาบาล
      validItem?.forEach((v) => {
        if (v.dru && (item.totalAmount > 0 || item.overAmount > 0)) {
          item.valid = item.valid?.concat(v.dru);
        }
      });
      return item;
    } else if (item.chrgitem.startsWith(additionalPaymentChargePrefix)) {
      //item J1 | J2
      validItem?.forEach((v) => {
        if (v.adp) {
          item.valid = item.valid?.concat(v.adp);
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

export function getChargeText(chargeCode: string) {
  if (chargeCode.startsWith(roomAndFoodChargePrefix)) return "ค่าห้อง/ค่าอาหาร";
  if (chargeCode.startsWith(instrumentChargePrefix)) return "อวัยวะเทียม/อุปกรณ์ในการบำบัดรักษา";
  if (chargeCode.startsWith(drugInChargePrefix)) return "ยาและสารอาหารทางเส้นเลือดที่ใช้ในโรงพยาบาล";
  if (chargeCode.startsWith(drugExChargePrefix)) return "ยาที่นำไปใช้ต่อที่บ้าน";
  if (chargeCode.startsWith(nonDrugChargePrefix)) return "เวชภัณฑ์ที่ไม่ใช่ยา";
  if (chargeCode.startsWith(bloodAndCpnChargePrefix)) return "บริการโลหิตและส่วนประกอบของโลหิต";
  if (chargeCode.startsWith(diagnosisMedChargePrefix)) return "ตรวจวินิจฉัยทางเทคนิคการแพทย์และพยาธิวิทยา";
  if (chargeCode.startsWith(diagnosisXrayChargePrefix)) return "ตรวจวินิจฉัยและรักษาทางรังสีวิทยา";
  if (chargeCode.startsWith(diagnosisSpecialChargePrefix)) return "ตรวจวินิจฉัยด้วยวิธีพิเศษอื่นๆ";
  if (chargeCode.startsWith(equipmentMedChargePrefix)) return "อุปกรณ์ของใช้และเครื่องมือทางการแพทย์";
  if (chargeCode.startsWith(phyProcedureChargePrefix)) return "ทำหัตถการ และบริการวิสัญญี";
  if (chargeCode.startsWith(feeServicesMedChargePrefix)) return "ค่าบริการทางการพยาบาล";
  if (chargeCode.startsWith(dentistryChargePrefix)) return "บริการทางทัตนกรรม";
  if (chargeCode.startsWith(phyTherapyMedChargePrefix)) return "บริการทางกายภาพบำบัด และเวชกรรมฟื้นฟู";
  if (chargeCode.startsWith(otherTherapyMedChargePrefix)) return "บริการสงเข็ม/การบำบัดของผู้ประกอบโรคศิลปะอื่นๆ";
  if (chargeCode.startsWith(operRoomChargePrefix)) return "ค่าห้องผ่าตัดและห้องคลอด";
  if (chargeCode.startsWith(personnelMedChargePrefix)) return "ค่าธรรมเนียมบุคลกรทางการแพทย์";
  if (chargeCode.startsWith(diseasePreventChargePrefix)) return "บริการอื่นๆ และส่งเสริมป้องกันโรค";
  if (chargeCode.startsWith(additionalPaymentChargePrefix)) return "บริการอื่นๆ ที่ยังไม่ได้จัดหมวด";
  if (chargeCode.startsWith(statuteChargePrefix)) return "พรบ.";
  return defaultStrEmpty;
}

export function getChargeTypes(chargeCode: string): string[] {
  if (chargeCode.startsWith(roomAndFoodChargePrefix)) return roomAndFoodAdpType;
  if (chargeCode.startsWith(instrumentChargePrefix)) return instrumentAdpType;
  if (chargeCode.startsWith(drugInChargePrefix)) return drugAdpType;
  if (chargeCode.startsWith(drugExChargePrefix)) return drugAdpType;
  if (chargeCode.startsWith(nonDrugChargePrefix)) return nonDrugAdpType;
  if (chargeCode.startsWith(bloodAndCpnChargePrefix)) return bloodAndCpnAdpType;
  if (chargeCode.startsWith(diagnosisMedChargePrefix)) return diagnosisMedAdpType;
  if (chargeCode.startsWith(diagnosisXrayChargePrefix)) return diagnosisXrayAdpType;
  if (chargeCode.startsWith(diagnosisSpecialChargePrefix)) return diagnosisSpecialAdpType;
  if (chargeCode.startsWith(equipmentMedChargePrefix)) return equipmentMedAdpType;
  if (chargeCode.startsWith(phyProcedureChargePrefix)) return phyProcedureAdpType;
  if (chargeCode.startsWith(feeServicesMedChargePrefix)) return feeServicesMedAdpType;
  if (chargeCode.startsWith(dentistryChargePrefix)) return dentistryAdpType;
  if (chargeCode.startsWith(phyTherapyMedChargePrefix)) return phyTherapyMedAdpType;
  if (chargeCode.startsWith(otherTherapyMedChargePrefix)) return otherTherapyMedAdpType;
  if (chargeCode.startsWith(operRoomChargePrefix)) return operRoomAdpType;
  if (chargeCode.startsWith(personnelMedChargePrefix)) return personnelMedAdpType;
  if (chargeCode.startsWith(diseasePreventChargePrefix)) return diseasePreventAdpType;
  if (chargeCode.startsWith(additionalPaymentChargePrefix)) return additionalPaymentAdpType;
  if (chargeCode.startsWith(statuteChargePrefix)) return statuteAdpType;
  return [];
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

function getNewInvoiceItemData(visitDetail: VisitDetailModel, patData: PatientDetailModel): InvoiceItemModel {
  let result: InvoiceItemModel = {
    id: "",
    hn: patData.hn,
    an: visitDetail.an,
    date: visitDetail.visitDate,
    chrgitem: "",
    amount: 0,
    person_id: patData.person_id,
    seq: visitDetail.seq,
  };
  return result;
}

export function convertEditorToCha(chaEditors: InvoiceItemEditorModel[], visitDetail: VisitDetailModel, patData: PatientDetailModel): InvoiceItemModel[] {
  let results: InvoiceItemModel[] = [];
  let chaItems: InvoiceItemEditorModel[] = [...chaEditors].filter(t => t.seq != '0');
  let excludeProps = ['dummyKey', 'isDurty', 'totalAmount', 'overAmount', 'chargeDetail', 'status', 'valid'];
  chaItems.forEach(item => {
    let overAmount: number = Number(item.overAmount.toString());
    // let totalAmount: number = overAmount > 0 ? Number(item.totalAmount.toString()) - overAmount : Number(item.totalAmount.toString());
    let totalAmount: number = Number(item.totalAmount.toString());

    let dataSuffix1: InvoiceItemModel = getNewInvoiceItemData(visitDetail, patData);
    Object.keys(item).forEach((prop1) => {
      if (excludeProps.includes(prop1)) return;

      let prop1Value = item[prop1 as keyof InvoiceItemModel];
      if (prop1 == 'date') prop1Value = moment(item[prop1]).format(dateInterfaceFormat);

      dataSuffix1 = { ...dataSuffix1, [prop1]: prop1Value };
    });
    results.push({
      ...dataSuffix1,
      id: newUid(),
      chrgitem: item.chrgitem[0] + '1',
      amount: (totalAmount < 0 ? 0 : totalAmount),
    });

    if (overAmount > 0) {
      let dataSuffix2: InvoiceItemModel = getNewInvoiceItemData(visitDetail, patData);
      Object.keys(item).forEach((prop2) => {
        if (excludeProps.includes(prop2)) return;

        let prop2Value = item[prop2 as keyof InvoiceItemModel];
        if (prop2 == 'date') prop2Value = moment(item[prop2]).format(dateInterfaceFormat);

        dataSuffix2 = { ...dataSuffix2, [prop2]: prop2Value };
      });
      results.push({
        ...dataSuffix2,
        id: newUid(),
        chrgitem: item.chrgitem[0] + '2',
        amount: overAmount,
      });
    }

  });
  return results.filter(t => t.amount != 0);
}

export function convertEditorToCht(chtOriginals: InvoiceModel[], chaEditors: InvoiceItemEditorModel[], isIPD: boolean): InvoiceModel[] {
  let results: InvoiceModel[] = [];
  chtOriginals.forEach((cht) => {
    let items = isIPD ? [...chaEditors.filter(t => t.an == cht.an)] : [...chaEditors.filter(t => t.seq == cht.seq)];
    let totalAmount: number = items.length > 0
      ? items.map(a => a.totalAmount).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
      : 0;
    results.push({
      ...cht,
      total: totalAmount
    });
  });
  return results;
}
