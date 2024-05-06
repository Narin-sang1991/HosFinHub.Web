import { OpdValids } from "../work-opd/opdEditorModel";

export interface InvoiceItemModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  chrgitem: string; // code of payment method in announcement
  amount: number; // amount of invoice item
  person_id: string; // id of person
  seq: string; // transaction key
}

export interface InvoiceItemEditorModel extends InvoiceItemModel {
  dummyKey: number; // dummy key for UI component
  isDurty: boolean;
  totalAmount: number;
  overAmount: number;
  chargeDetail: string;
  status: number;
  valid?: OpdValids[];
}