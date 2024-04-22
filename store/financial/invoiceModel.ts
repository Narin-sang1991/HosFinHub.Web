export interface InvoiceModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  total: number; // total of payment
  paid: number; // paid
  pttype: number;
  person_id: string; // id of person
  seq: number; // transaction key
  opd_memo?: string;
  invoice_no?: string; // invoice number
  invoice_lt?: string; // invoice number of service point
}

export interface InvoiceItemModel {
  id: string; // unique key of data
  hn: string; // patient number
  an?: string; // admit number
  date: Date; // start date or discharge date or insurance change date
  chrgitem: string; // code of payment method in announcement
  amount: number; // amount of invoice item
  person_id: string; // id of person
  seq: number; // transaction key
}

export interface InvoiceEditorModel {
  id: string; // unique key of data
  seq: number; // transaction key
  dummyKey: number; // dummy key for UI component
  idDurty: boolean;
  totalAmount: number;
  overAmount: number;
  approvedAmount: number;
  chargeCode: string;
  chargeDetail: string;
  status: number;
  valid?: any[];
}