
import { v4 as uuidv4 } from "uuid";
import type { InvoiceItemEditorModel, } from "@/store/financial/invoiceItemModel";
import { AdditPaymentModelEditorModel, AdditionalPaymentModel } from "@/store/fee-additional/additionalModel";
import { additionalPaymentChargePrefix, getChargeText } from "./invoice.billing.constant";
import { OpdDetailModel, OpdValids } from "@/store/work-opd/opdEditorModel";
import { PatientDetailModel } from "@/store/patient/patientModel";

//#region Additional Payment Type
export const adpTypeInstrument = "2";
export const adpTypeNonGroup = "3";
export const adpTypeFreeSchedule = "8";
//#endregion

type CalcAdpChargesProps = {
  opdData?: OpdDetailModel,
  patientData?: PatientDetailModel,
  invoiceEditors: InvoiceItemEditorModel[],
  adtEditors: AdditPaymentModelEditorModel[],
  reconcile?: boolean,
};
export async function recalcAdpCharges({
  opdData, patientData, invoiceEditors, adtEditors, reconcile }: CalcAdpChargesProps
): Promise<InvoiceItemEditorModel[]> {
  if (adtEditors.length == 0) return invoiceEditors;
  let results: InvoiceItemEditorModel[] = [...invoiceEditors];
  let overAmount: number = adtEditors.length > 0
    ? adtEditors.map(a => a.totcopay).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let sumTotal: number = adtEditors.length > 0
    ? adtEditors.map(a => a.total).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let adtErr: boolean = adtEditors.length > 0
    ? adtEditors.filter(a => a.hasError == true).length > 0
    : false;

  let invoiceAdpIndex = invoiceEditors.findIndex(t => t.chrgitem.startsWith(additionalPaymentChargePrefix));
  if (invoiceAdpIndex <= -1) {
    let chrgitem = additionalPaymentChargePrefix + '1';
    const newId = uuidv4();
    let newInvoiceItem: InvoiceItemEditorModel = {
      id: newId,
      seq: opdData?.seq || "",
      hn: opdData?.hn || "",
      person_id: patientData?.person_id || "",
      date: opdData?.dateopd || new Date,
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
    let invoiceAdp = invoiceEditors[invoiceAdpIndex];
    let calcResult: number = (reconcile === true
      ? Number(sumTotal.toString()) + Number(invoiceAdp.totalAmount.toString())
      : sumTotal);
    let editItem: InvoiceItemEditorModel = {
      ...invoiceAdp,
      seq: opdData?.seq || "",
      totalAmount: calcResult,
      overAmount: overAmount,
      status: 1,
      isDurty: true,
    };
    results.splice(invoiceAdpIndex, 1, editItem);
  }
  return await results;
}

function getErrorToAdpCharges(itemId :string) :OpdValids[] {
  let results : OpdValids[] = [{
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