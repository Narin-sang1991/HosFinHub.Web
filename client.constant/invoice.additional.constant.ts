
import { v4 as uuidv4 } from "uuid";
import type {  InvoiceItemEditorModel, } from "@/store/financial/invoiceItemModel";
import { AdditPaymentModelEditorModel } from "@/store/free-additional/additionalModel";
import { additionalPaymentChargePrefix, getChargeDetails } from "./invoice.billing.constant";
 
//#region Additional Payment Type
export const adpTypeNonGroup = "3";
//#endregion
 
type CalcAdpChargesProps = {
  seqKey: string,
  invoiceEditors: InvoiceItemEditorModel[],
  adtEditors: AdditPaymentModelEditorModel[],
  reconcile?: boolean,
};
export async function recalcAdpCharges({
  seqKey, invoiceEditors, adtEditors, reconcile }: CalcAdpChargesProps
): Promise<InvoiceItemEditorModel[]> {
  // if (adtEditors.length == 0) return invoiceEditors;

  let results: InvoiceItemEditorModel[] = [...invoiceEditors];
  let overAmount: number = 0;
  let approvedAmount: number = 0;
  let sumTotal: number = adtEditors.length > 0
    ? adtEditors.map(a => a.total).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let requestTotal: number = adtEditors.length > 0
    ? adtEditors.map(a => a.totalreq).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let adtErr: boolean = adtEditors.length > 0
    ? adtEditors.filter(a => a.hasError == true).length > 0
    : false;

  let invoiceAdpIndex = invoiceEditors.findIndex(t => t.chargeCode.startsWith(additionalPaymentChargePrefix));
  if (invoiceAdpIndex <= -1) {

    let chrgitem = additionalPaymentChargePrefix + '1';
    let newInvoiceItem: InvoiceItemEditorModel = {
      id: uuidv4(),
      seq: seqKey,
      dummyKey: (invoiceEditors.length || 0) + 1,
      idDurty: true,
      totalAmount: sumTotal,
      overAmount: requestTotal > 0 ? sumTotal - requestTotal : overAmount,
      approvedAmount: requestTotal > 0 ? requestTotal : approvedAmount,
      chargeCode: chrgitem,
      chargeDetail: getChargeDetails(chrgitem),
      status: 1,
    };
    if (adtErr) pushErrorToAdpCharges(newInvoiceItem);

    results.push(newInvoiceItem);
  }
  else {
    let invoiceAdp = invoiceEditors[invoiceAdpIndex];
    let calcResult: number = (reconcile === true
      ? Number(sumTotal.toString()) + Number(invoiceAdp.totalAmount.toString())
      : sumTotal);
    let editItem: InvoiceItemEditorModel = {
      ...invoiceAdp,
      totalAmount: calcResult,
      overAmount: requestTotal > 0 ? calcResult - requestTotal : overAmount,
      approvedAmount: requestTotal > 0 ? requestTotal : approvedAmount,
      status: 1,
      idDurty: true,
    };
    if (adtErr) pushErrorToAdpCharges(editItem);

    results.splice(invoiceAdpIndex, 1, editItem);
  }
  return await results;
}

function pushErrorToAdpCharges(invoiceItem: InvoiceItemEditorModel) {
  invoiceItem.valid = [{
    code_error: "E000",
    code_error_descriptions: "ต้องระบุรหัสรายการ"
  }];
}