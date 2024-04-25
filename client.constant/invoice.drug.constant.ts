import { v4 as uuidv4 } from "uuid";
import type { InvoiceDrugModel, InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import { InvoiceItemEditorModel } from "@/store/financial/invoiceItemModel";
import { OpdValidModel, OpdValids } from "@/store/work-opd/opdEditorModel";
import { drugExChargePrefix, getChargeDetails } from "./invoice.billing.constant";

export function genarateDrugEditors(
  drugItems: InvoiceDrugModel[],
  validItems: OpdValidModel[] | undefined
) {
  let results: InvoiceDrugEditorModel[] = [];
  drugItems.forEach((drugItem, i) => {
    //assing Error
    const itemDruError = validItems?.filter((i) => i.dru)[0][
      "dru"
    ] as unknown as OpdValids[];
    const assignItemError = itemDruError.filter((i) => i.id === drugItem.id);

    let dummyKey: number = i + 1;
    let data: InvoiceDrugEditorModel = {
      ...drugItem,
      dummyKey,
      isDurty: false,
      totalreq: 0.00,
      hasError: (assignItemError.length !== 0),
      validError: assignItemError,
    };
    results.push(data);
  });
  return results;
}

type CalcDrugChargesProps = {
  seqKey: string,
  invoiceEditors: InvoiceItemEditorModel[],
  drugEditors: InvoiceDrugEditorModel[],
};
export async function recalcDrugCharges({
  seqKey, invoiceEditors, drugEditors }: CalcDrugChargesProps
): Promise<InvoiceItemEditorModel[]> {

  // if (drugEditors.length == 0) return invoiceEditors;

  let results: InvoiceItemEditorModel[] = [...invoiceEditors];
  let overAmount: number = drugEditors.length > 0
    ? drugEditors.map(a => a.totcopay).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let reqestTotal: number = drugEditors.length > 0
    ? drugEditors.map(a => a.totalreq).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let sumTotal: number = drugEditors.length > 0
    ? drugEditors.map(a => a.total).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let drugErr: boolean = drugEditors.length > 0
    ? drugEditors.filter(a => a.hasError == true).length > 0
    : false;
  let totalAmount = (reqestTotal > 0 ? reqestTotal : sumTotal);
  let invoiceDrugIndex = invoiceEditors.findIndex(t => t.chrgitem.startsWith(drugExChargePrefix));
  const invoiceFirst = invoiceEditors[0];
  if (invoiceDrugIndex <= -1) {
    let chrgitem = drugExChargePrefix + '1';
    let newInvoiceItem: InvoiceItemEditorModel = {
      ...invoiceFirst,
      id: uuidv4(),
      seq: seqKey,
      dummyKey: (invoiceEditors.length || 0) + 1,
      isDurty: true,
      totalAmount: totalAmount,
      overAmount,
      approvedAmount: 0,
      chrgitem: chrgitem,
      chargeDetail: getChargeDetails(chrgitem),
      status: 1,
      valid: [],
    };
    results.push(newInvoiceItem);
  }
  else {
    let invoiceDrug = invoiceEditors[invoiceDrugIndex];
    let editItem: InvoiceItemEditorModel = {
      ...invoiceDrug,
      totalAmount: totalAmount,
      overAmount,
      approvedAmount: 0,
      status: 1,
      isDurty: true,
    };
    if (!drugErr) editItem.valid = [];

    results.splice(invoiceDrugIndex, 1, editItem);
  }
  return await results;
}


export function convertEditorToDru(druEditors: InvoiceDrugEditorModel[]): InvoiceDrugModel[] {
  let results: InvoiceDrugModel[] = [];
  let excludeProps = ['dummyKey', 'totalreq', 'isDurty', 'hasError', 'validError'];
  druEditors.forEach(item => {
    let data: InvoiceDrugModel;
    Object.keys(item).forEach((prop) => {
      if (!excludeProps.includes(prop)) data = { ...data, [prop]: item[prop] };
    });
    results.push(data);
  });
  return results;
}
