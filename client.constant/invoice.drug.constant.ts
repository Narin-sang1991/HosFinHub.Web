
import { v1 as newUid } from "uuid";
import moment from "moment";
import type { InvoiceDrugModel, InvoiceDrugEditorModel } from "@/store/financial/invoiceDrugModel";
import { InvoiceItemEditorModel } from "@/store/financial/invoiceItemModel";
import { drugExChargePrefix, getChargeText } from "./invoice.billing.constant";
import { OpdValidModel, instanceOfOpdValids } from "@/store/work-opd/opdEditorModel";
import { IpdValidModel, instanceOfIpdValids } from "@/store/work-ipd/ipdEditorModel";
import { WorkValidModel } from "@/store/work/workValidModel";
import { dateInterfaceFormat } from "@/client.constant/format.constant";

export function genarateDrugEditors(drugItems: InvoiceDrugModel[], validItems: OpdValidModel[] | IpdValidModel[] | undefined) {
  let results: InvoiceDrugEditorModel[] = [];
  let itemDruError: WorkValidModel[] = [];

  // if (instanceOfOpdValids(validItems) && validItems.length > 0) itemDruError = validItems[0].dru
  // if (instanceOfIpdValids(validItems) && validItems.length > 0) itemDruError = validItems[0].dru


  if (validItems !== undefined) {
    const druError = validItems.filter(item => item.dru)[0]
    console.log(druError);
    if (druError.dru !== undefined) {

      if (druError.dru.length > 0) {
        itemDruError = druError.dru
      }

    }

  }

  console.log(itemDruError);

  drugItems.forEach((drugItem, i) => {
    const assignItemError = (itemDruError).filter((i) => i.id === drugItem.id);
    let dummyKey: number = i + 1;
    let data: InvoiceDrugEditorModel = {
      ...drugItem,
      dummyKey,
      isDurty: false,
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

  let sumTotal: number = drugEditors.length > 0
    ? drugEditors.map(a => a.total).reduce(function (a, b) { return Number(a.toString()) + Number(b.toString()); })
    : 0;
  let drugErr: boolean = drugEditors.length > 0
    ? drugEditors.filter(a => a.hasError == true).length > 0
    : false;
  let invoiceDrugIndex = invoiceEditors.findIndex(t => t.chrgitem.startsWith(drugExChargePrefix));
  const invoiceFirst = invoiceEditors[0];
  if (invoiceDrugIndex <= -1) {
    let chrgitem = drugExChargePrefix + '1';
    let newInvoiceItem: InvoiceItemEditorModel = {
      ...invoiceFirst,
      id: newUid(),
      seq: seqKey,
      dummyKey: (invoiceEditors.length || 0) + 1,
      isDurty: true,
      totalAmount: sumTotal,
      overAmount,
      chrgitem: chrgitem,
      chargeDetail: getChargeText(chrgitem),
      status: 1,
      valid: [],
    };
    results.push(newInvoiceItem);
  }
  else {
    let invoiceDrug = invoiceEditors[invoiceDrugIndex];
    let editItem: InvoiceItemEditorModel = {
      ...invoiceDrug,
      totalAmount: sumTotal,
      overAmount,
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
  let excludeProps = ['dummyKey', 'isDurty', 'hasError', 'validError'];
  druEditors.forEach((item) => {
    let data: InvoiceDrugModel = {
      id: "",
      hcode: "",
      hn: "",
      clinic: "",
      date_serv: new Date(),
      person_id: "",
      did: "",
      didname: "",
      amount: 0,
      drugprice: 0,
      drugcost: 0,
      didstd: 0,
      unit: "",
      unit_pack: "",
      seq: "",
      drugremark: "",
      totcopay: 0,
      use_status: 0,
      total: 0,
      sigcode: "",
      sigtext: ""
    };
    Object.keys(item).forEach((prop) => {
      if (excludeProps.includes(prop)) return;

      let propValue = item[prop as keyof InvoiceDrugModel];
      if (prop == 'date_serv') propValue = moment(item[prop]).format(dateInterfaceFormat);

      data = { ...data, [prop]: propValue };
    });
    results.push(data);
  });

  return results;
}
