
import { v4 as uuidv4 } from "uuid";
import type { InvoiceItemEditorModel, } from "@/store/financial/invoiceItemModel";
import { AdditPaymentModelEditorModel, AdditionalPaymentModel } from "@/store/fee-additional/additionalModel";
import { additionalPaymentChargePrefix, allChargeItems, drugExChargePrefix, drugInChargePrefix, getChargeText } from "./invoice.billing.constant";
import { PatientDetailModel } from "@/store/patient/patientModel";
import { WorkValidModel } from "@/store/work/workValidModel";
import { VisitDetailModel } from "@/store/work/workEditorModel";

//#region Additional Payment Type
export const adpTypeInstrument = "2";
export const adpTypeNonGroup = "3";
export const adpTypeFreeSchedule = "8";
//#endregion

type CalcAdpChargesProps = {
  visitDetail?: VisitDetailModel,
  patientData?: PatientDetailModel,
  invoiceEditors: InvoiceItemEditorModel[],
  adtEditors: AdditPaymentModelEditorModel[],
  chargeCalcScope: string,
  reconcile?: boolean,
};
export async function recalcAdpCharges({
  visitDetail, patientData, invoiceEditors, adtEditors, chargeCalcScope, reconcile }: CalcAdpChargesProps
): Promise<InvoiceItemEditorModel[]> {
  if (adtEditors.length == 0) return invoiceEditors;

  const chargeItem = allChargeItems.find(t => chargeCalcScope.startsWith(t.prefix));
  if (chargeItem == undefined) return invoiceEditors;
  if (chargeItem.prefix == drugInChargePrefix || chargeItem.prefix == drugExChargePrefix) return invoiceEditors;

  let results: InvoiceItemEditorModel[] = [...invoiceEditors];
  const adpInCharges = [...adtEditors.filter(t => chargeItem.chargeTypes.includes(t.type))];
  let overAmount: number = adpInCharges.length > 0
    ? adpInCharges.map(a => a.totcopay).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let sumTotal: number = adpInCharges.length > 0
    ? adpInCharges.map(a => a.total).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let adtErr: boolean = adpInCharges.length > 0
    ? adpInCharges.filter(a => a.hasError == true).length > 0
    : false;

  let invoiceItemIndex = invoiceEditors.findIndex(t => t.chrgitem.startsWith(chargeItem.prefix));
  if (invoiceItemIndex <= -1) {
    let chrgitem = additionalPaymentChargePrefix + '1';
    const newId = uuidv4();
    let newInvoiceItem: InvoiceItemEditorModel = {
      id: newId,
      hn: visitDetail?.hn || "",
      seq: visitDetail?.seq || "",
      an: visitDetail?.an || "",
      person_id: patientData?.person_id || "",
      date: visitDetail?.visitDate || new Date,
      dummyKey: (invoiceEditors.length || 0) + 1,
      isDurty: true,
      amount: sumTotal,
      totalAmount: sumTotal,
      overAmount: overAmount,
      chrgitem: chrgitem,
      chargeDetail: getChargeText(chrgitem),
      status: 1,
      valid: adtErr ? getErrorToAdpCharges(newId) : [],
    };
    results.push(newInvoiceItem);
  } else {
    let invoiceAdp = invoiceEditors[invoiceItemIndex];
    // console.log("reconcile", reconcile);
    // console.log("invoiceAdp.totalAmount", invoiceAdp.totalAmount);
    let calcResult: number = (reconcile === true
      ? sumTotal
      : invoiceAdp.totalAmount > 0 ? invoiceAdp.totalAmount : sumTotal);
    let overResult: number = (reconcile === true
      ? overAmount
      : invoiceAdp.overAmount > 0 ? invoiceAdp.overAmount : overAmount);
    let editItem: InvoiceItemEditorModel = {
      ...invoiceAdp,
      seq: visitDetail?.seq || "",
      an: visitDetail?.an || "",
      hn: visitDetail?.hn || "",
      person_id: patientData?.person_id || "",
      date: visitDetail?.visitDate || new Date,
      totalAmount: calcResult,
      overAmount: overResult,
      status: 1,
      isDurty: true,
      valid: adtErr ? invoiceAdp.valid : [],
    };
    results.splice(invoiceItemIndex, 1, editItem);
  }

  return await results;
}

export function getErrorToAdpCharges(itemId: string): WorkValidModel[] {
  let results: WorkValidModel[] = [{
    id: itemId,
    code_error: "E000",
    code_error_descriptions: "ต้องระบุรหัสรายการ",
    an: "",
    did: "",
    didname: "",
    file: "",
    hn: "",
    seq: ""
  }];
  return results;
}